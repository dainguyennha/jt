import json
from flask import request
from functools import wraps

import pyrebase
import firebase_admin
from firebase_admin import auth
from environs import Env

env = Env()
env.read_env()

config = {
    "apiKey": env.str("apiKey"),
    "authDomain": env.str("authDomain"),
    "databaseURL": env.str("databaseURL"),
    "projectId": env.str("projectId"),
    "storageBucket": env.str("storageBucket"),
    "messagingSenderId": env.str("messagingSenderId")
}
firebase = pyrebase.initialize_app(config)

cred = firebase_admin.credentials.Certificate({
    "type": env.str("type"),
    "project_id": env.str("project_id"),
    "private_key_id": env.str("private_key_id"),
    "private_key": env.str("private_key").replace('\\n', '\n'),
    "client_email": env.str("client_email"),
    "client_id": env.str("client_id"),
    "auth_uri": env.str("auth_uri"),
    "token_uri": env.str("token_uri"),
    "auth_provider_x509_cert_url": env.str("auth_provider_x509_cert_url"),
    "client_x509_cert_url": env.str("client_x509_cert_url")
})

firebase_admin.initialize_app(cred)
auth2 = firebase.auth()
db = firebase.database()


class AuthError(Exception):
    def __init__(self, error, status_code):
        self.error = error
        self.status_code = status_code


def get_token_auth_header():
    """Obtains the Access Token from the Authorization Header
    """
    auth = request.headers.get('Authorization', None)
    if not auth:
        raise AuthError({
            'code': 'authorization_header_missing',
            'description': 'Authorization header is expected.'
        }, 401)

    parts = auth.split()

    if parts[0].lower() != 'bearer':
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must start with "Bearer".'
        }, 401)

    elif len(parts) == 1:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Token not found.'
        }, 401)

    elif len(parts) > 2:
        raise AuthError({
            'code': 'invalid_header',
            'description': 'Authorization header must be bearer token.'
        }, 401)

    token = parts[1]
    return token


def requires_auth(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        id_token = get_token_auth_header()
        print(auth2.get_account_info(id_token))
        auth.verify_id_token(id_token)
        return f(*args, **kwargs)
    return decorated
