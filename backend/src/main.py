# coding=utf-8

from flask import Flask, jsonify, request
from flask_cors import CORS
from .auth import AuthError, requires_auth
from flask_pymongo import PyMongo
from bson import json_util
from environs import Env

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
    # objects = set()
    extracted = list(mongo.db.rois.find({'video_id': id}))
    for roi in extracted:
        products.add(roi['product_id'])
        # objects.add(roi['object_id'])
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

    # extracted = list(mongo.db.objects.find(
    #     {"object_id": {"$in": list(objects)}}))
    # for object in extracted:
    #     processed.append({
    #         'id': object['object_id'],
    #         'subtitle': object['object_subtitle'],
    #         'title': object['object_name'],
    #         'description': object['object_short_desc'],
    #         'moreUrl': object['object_more_url'],
    #         'thumbnail': app.config['CDN_ROOT']+'/thumbnails/products/'+object['object_id']+'/'+object['object_id']+'.jpg'
    #     })
    return json_util.dumps(processed, ensure_ascii=False).encode('utf8')


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
@requires_auth
def bookmark(id=None):
    if request.method == 'POST':
        mongo.db.bookmarks.insert({
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
                'video': bookmark['video'],
                'item': bookmark['item'],
                'location': bookmark['location'],
                'created': bookmark['created'],
                'thumbnail': app.config['CDN_ROOT']+'/thumbnails/products/'+bookmark['item']['id']+'/'+bookmark['item']['id']+'.jpg'
            })
        return json_util.dumps(processed, ensure_ascii=False).encode('utf8')


@app.errorhandler(AuthError)
def handle_auth_error(ex):
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response
