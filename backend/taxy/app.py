import os

from pathlib import Path
from http import HTTPStatus

from flask import Flask, jsonify, request, current_app
from flask.helpers import send_from_directory
from flask_pymongo import PyMongo

from werkzeug.utils import secure_filename

from taxy.document_analyzer import scan_document
from taxy.errors import ApiError

def make_app():
    app = Flask(__name__)
    #app.url_map.strict_slashes = False
    app.debug = True

    # MongoDB
    app.config["MONGO_URI"] = os.environ.get("DB", "mongodb://localhost/taxy")
    app.config["UPLOAD_FOLDER"] = Path(os.getenv("UPLOAD_FOLDER", "data"))

    mongo = PyMongo(app)
    app.mongo = mongo

    @app.route("/document", methods=["POST"])
    def root():
        if "file" not in request.files:
            return {"message": "No file given in the request"}, HTTPStatus.BAD_REQUEST

        uploaded_file = request.files["file"]
        if uploaded_file.filename == "":
            return {"message": "No file selected for uploading"}, HTTPStatus.BAD_REQUEST

        base_path = app.config["UPLOAD_FOLDER"]
        target_file = base_path / secure_filename(uploaded_file.filename)

        # ensure directory for the uploaded doc exists
        base_path.mkdir(parents=True, exist_ok=True)

        # save the upploaded documentation
        uploaded_file.save(str(target_file))
        result = scan_document(target_file)

        return {"content": result}, HTTPStatus.CREATED

    @app.route("/dummyImage", methods=['GET'])
    def dummyImage():
        return {"image":"static/Lohn_Lohnausweis.jpg",
        "highlights":[
                {"x":0,"y":0,"height":100,"width":100, "name": "💩", "id":"1"},
                {"x":169,"y":242,"height":69,"width":96, "name": "No heck No Sneck! 🐍", "id":"2"},
        ]
              }

    @app.route('/static/<path:path>')
    def send_js(path):
        return send_from_directory('static', path)
    return app
