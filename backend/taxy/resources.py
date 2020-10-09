import itertools
from datetime import datetime

import emoji
import pymongo
from flask import Blueprint, request, jsonify
from flask import current_app
from bson.json_util import dumps

from taxy.errors import ApiError


posts_api = Blueprint("posts", "posts")


@posts_api.route("/", methods=["GET"])
def list_posts():
    return dumps({"message": "hooi"})