# coding=utf-8

from flask import Flask, jsonify, request
from flask_cors import CORS
from .auth import AuthError, requires_auth
from flask_pymongo import PyMongo
from bson import json_util
from environs import Env
import boto3
import ffmpy

env = Env()
env.read_env()
DEBUG = env.bool("FLASK_DEBUG", default=True)

app = Flask(__name__)
CORS(app)

app.config['MONGO_URI'] = env.str('MONGO_URI')
app.config['CDN_ROOT'] = env.str('CDN_ROOT')

mongo = PyMongo(app)

@app.route('/add')
def add():
    user = mongo.db.users
    user.insert({'name': 'aa'})
    return 'Added user'

@app.route('/video/<string:id>', methods=['GET'])
def get_video(id):
    video = mongo.db.videos.find_one_or_404({'video_id': id})
    processed = {
        'id': video['video_id'],
        'title': video['video_title'],
        'description': video['video_description'],
        'author': video['user_name'],
        'duration': video['video_duration'],
        'thumbnail': app.config['CDN_ROOT']+'/thumbnails/videos/'+video['video_id']+'/'+video['video_id']+'.jpg',
        'source': app.config['CDN_ROOT']+'/video/'+video['user_id']+'/'+video['video_id']+'/'+video['video_id']+'.mp4'
    }
    return json_util.dumps(processed, ensure_ascii=False).encode('utf8')

@app.route('/rois/<string:id>', methods=['GET'])
def get_rois(id):
    processed = []
    extracted = list(mongo.db.rois.find({'video_id': id}))
    for roi in extracted:
        exid = roi['object_id']
        if not exid:
            exid = roi['product_id']
        if exid:
            processed.append({
                'video': roi['video_id'],
                'item': exid,
                'data': {
                    'ix': roi['roi_group_data']['ix'],
                    'iy': roi['roi_group_data']['iy'],
                    'start': roi['roi_group_data']['start'],
                    'end': roi['roi_group_data']['end']
                }
            })
    return json_util.dumps(processed, ensure_ascii=False).encode('utf8')

@app.route('/items/<string:id>', methods=['GET'])
def get_items(id):
    products = set()
    objects = set()
    extracted = list(mongo.db.rois.find({'video_id': id}))
    for roi in extracted:
        products.add(roi['product_id'])
        objects.add(roi['object_id'])
    # products.remove("")
    # objects.remove("")

    processed = []
    extracted = list(mongo.db.products.find(
        {"product_id": {"$in": list(products)}}))
    for product in extracted:
        processed.append({
            'id': product['product_id'],
            'subtitle': product['product_brand'],
            'title': product['product_name'],
            'description': product['product_short_desc'],
            'moreUrl': product['more_url'],
            'thumbnail': app.config['CDN_ROOT']+'/thumbnails/products/'+product['product_id']+'/'+product['product_id']+'.jpg'
        })

    extracted = list(mongo.db.objects.find(
        {"object_id": {"$in": list(objects)}}))
    for object in extracted:
        processed.append({
            'id': object['object_id'],
            'subtitle': object['object_subtitle'],
            'title': object['object_name'],
            'description': object['object_short_desc'],
            'moreUrl': object['object_more_url'],
            'thumbnail': app.config['CDN_ROOT']+'/thumbnails/products/'+object['object_id']+'/'+object['object_id']+'.jpg'
        })
    return json_util.dumps(processed, ensure_ascii=False).encode('utf8')

@app.route('/item-roi', methods=['POST'])
def add_item_roi():
    mongo.db.objects.insert({
        'object_id': request.form['item_id'],
        'object_subtitle':request.form['item_subtitle'],
        'object_name':request.form['item_title'],
        'object_short_desc':request.form['item_des'],
        'object_more_url':request.form['item_more_url']
    })
    mongo.db.rois.insert({
        'object_id':request.form['item_id'],
        'video_id':request.form['video_id'],
        'roi_group_data':{
            'ix':request.form['roi-data-ix'],
            'iy':request.form['roi-data-iy'],
            'end':request.form['roi-data-end'],
            'start':request.form['roi-data-start'],
            },
        'product_id':''
    })
    added_roi_db = mongo.db.rois.find_one_or_404(
        {'roi_group_data':{
            'ix':request.form['roi-data-ix'],
            'iy':request.form['roi-data-iy'],
            'end':request.form['roi-data-end'],
            'start':request.form['roi-data-start'],
            }}
    )
    added_roi = {
                'video': added_roi_db['video_id'],
                'item': added_roi_db['object_id'],
                'data': {
                    'ix': added_roi_db['roi_group_data']['ix'],
                    'iy': added_roi_db['roi_group_data']['iy'],
                    'start': added_roi_db['roi_group_data']['start'],
                    'end': added_roi_db['roi_group_data']['end']
                }
            }
    added_item_db = mongo.db.objects.find_one_or_404({'object_id': request.form['item_id']})
    added_item = {
            'id': added_item_db['object_id'],
            'subtitle': added_item_db['object_subtitle'],
            'title': added_item_db['object_name'],
            'description': added_item_db['object_short_desc'],
            'moreUrl': added_item_db['object_more_url'],
            'thumbnail': app.config['CDN_ROOT']+'/thumbnails/products/'+added_item_db['object_id']+'/'+added_item_db['object_id']+'.jpg'
        }
    add_item_roi = {
        'added_item': added_item,
        'added_roi' : added_roi
    }
    return json_util.dumps(add_item_roi, ensure_ascii=False).encode('utf8'),201

@app.route('/delete-roi-item/<string:id>', methods=['GET'])
def del_roi_item(id):
    if mongo.db.rois.find({'object_id':id}):
        mongo.db.rois.remove({'object_id':id})
    if mongo.db.rois.find({'product_id':id}):
        mongo.db.rois.remove({'product_id':id})
    if mongo.db.objects.find({'object_id':id}):
        mongo.db.objects.remove({'object_id':id})
    if mongo.db.products.find({'products_id':id}):
        mongo.db.products.remove({'products_id':id})
    return jsonify(id), 201

@app.route('/videos', methods=['GET'])
def get_videos():
    processed = []
    extracted = list(mongo.db.videos.find({}))
    for video in extracted:
        processed.append({
            'id': video['video_id'],
            'title': video['video_title'],
            'description': video['video_description'],
            'author': video['user_name'],
            'duration': video['video_duration'],
            'thumbnail': app.config['CDN_ROOT']+'/thumbnails/videos/'+video['video_id']+'/'+video['video_id']+'.jpg'
        })
    return json_util.dumps(processed, ensure_ascii=False).encode('utf8')

@app.route('/bookmark', methods=['POST'])
@app.route('/bookmark/<string:id>', methods=['GET'])
# @requires_auth
def bookmark(id=None):
    if request.method == 'POST':
        video = mongo.db.videos.find_one_or_404({'video_id': request.form['video-id']})
        video_url = app.config['CDN_ROOT']+'/video/'+video['user_id']+'/'+video['video_id']+'/'+video['video_id']+'.mp4'
        
        def humanize_time(secs):
          mins, secs = divmod(secs, 60)
          hours, mins = divmod(mins, 60)
          return '%02d:%02d:%d' % (hours, mins, secs)

        ff = ffmpy.FFmpeg(
          inputs= {video_url: None},
          outputs= {"./assets/images/{}.png".format(request.form['item-id']): "-ss {} -vframes 1".format(humanize_time(float(request.form['location'])))})
        ff.run()

        bucketName = "jt-test-bkai"
        Key = "./assets/images/{}.png".format(request.form['item-id'])
        outPutname = "{}.png".format(request.form['item-id'])

        s3 = boto3.client('s3')
        s3.upload_file(Key,bucketName,outPutname, ExtraArgs={'ACL':'public-read'})
                
        mongo.db.bookmarks.insert({
            'id':request.form['video-id']+"-"+request.form['item-id']+"-"+request.form['user'],
            'video': {'id': request.form['video-id'],
                      'title': request.form['video-title']},
            'item': {'id': request.form['item-id'],
                     'title': request.form['item-title']},
            'location': request.form['location'],
            'user': request.form['user'],
            'created': request.form['created']
        })
        return '', 201
    else:
        processed = []
        extracted = list(mongo.db.bookmarks.find({'user': id}))
        for bookmark in extracted:
            processed.append({
                'id':bookmark['id'],
                'video': bookmark['video'],
                'item': bookmark['item'],
                'location': bookmark['location'],
                'created': bookmark['created'],
                'thumbnail': 'https://s3-ap-southeast-1.amazonaws.com/jt-test-bkai' +'/'+bookmark['item']['id']+'.png'
            })
        return json_util.dumps(processed, ensure_ascii=False).encode('utf8')

@app.route('/delete-bookmark/<string:id>')
def delete_book_mark(id):
    if mongo.db.bookmarks.find_one_or_404({'id':id}):
        mongo.db.bookmarks.remove({'id':id})
        return jsonify(id), 201

@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response
