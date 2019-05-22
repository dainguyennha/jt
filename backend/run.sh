#!/bin/bash
export FLASK_APP=./src/main.py
export FLASK_DEBUG=true
flask run -h 0.0.0.0 