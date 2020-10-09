import os

from http import HTTPStatus

from flask import Flask, jsonify, request, current_app
from flask_pymongo import PyMongo

from taxy.errors import ApiError


def make_app():
    app = Flask(__name__)
    #app.url_map.strict_slashes = False
    app.debug = True

    # MongoDB
    app.config["MONGO_URI"] = os.environ.get("DB", "mongodb://localhost/taxy")
    mongo = PyMongo(app)
    app.mongo = mongo

    @app.route("/", methods=["GET"])
    def root():
        return {"message": "hooi"}, HTTPStatus.OK

    return app
