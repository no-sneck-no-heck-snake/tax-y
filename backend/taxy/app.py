import os

from pathlib import Path
from http import HTTPStatus

from flask import Flask, jsonify, request, current_app
from flask.helpers import send_from_directory
from flask_pymongo import PyMongo
from pdf2image import convert_from_path
from flask_cors import CORS

from uuid import uuid4
from werkzeug.utils import secure_filename

from taxy.document_analyzer import scan_document
from taxy.errors import ApiError

from PIL import Image


def make_app():
    app = Flask(__name__)
    CORS(app)
    #app.url_map.strict_slashes = False
    app.debug = True
    app.host = "0.0.0.0"

    # MongoDB
    app.config["MONGO_URI"] = os.environ.get("DB", "mongodb://localhost/taxy")
    app.config["UPLOAD_FOLDER"] = Path(os.getenv("UPLOAD_FOLDER", "data"))

    mongo = PyMongo(app)
    app.mongo = mongo

    @app.route("/document", methods=["POST"])
    def root():
        user_session = request.cookies.get('_taxy_session', 0)
        if "file" not in request.files:
            return {"message": "No file given in the request"}, HTTPStatus.BAD_REQUEST

        uploaded_file = request.files["file"]
        if uploaded_file.filename == "":
            return {"message": "No file selected for uploading"}, HTTPStatus.BAD_REQUEST

        base_path = app.config["UPLOAD_FOLDER"]
        # ensure directory for the uploaded doc exists
        base_path.mkdir(parents=True, exist_ok=True)

        if uploaded_file.filename.suffix == ".pdf":
            someImage = convert_from_path(str(uploaded_file.filename))[0]
            target_file = base_path / (str(uuid4()) + ".jpg")
            someImage.save(target_file, 'JPEG')
        else:
            target_file = base_path / (str(uuid4()) + Path(uploaded_file.filename).suffix)
            uploaded_file.save(str(target_file))
            some_image = Image.open(str(uploaded_file.filename))

        result = scan_document(some_image)

        print(f'Saved file at: {target_file}')
        if not current_app.mongo.db.users.find_one({"_id": user_session}):
            current_app.mongo.db.users.insert({"_id": user_session})

        width, height = Image.open(str(target_file)).size

        current_app.mongo.db.taxinfo.insert({
            "user": user_session,
            "file":  str(target_file),
            "width": width,
            "height": height,
            "entry":
            {
                "type": result[0],
                "content": result[1]
            }
        })

        return {"content": result}, HTTPStatus.CREATED

    @app.route("/entry/<ObjectId:id_str>", methods=['GET'])
    def entry(id_str):
        entry = current_app.mongo.db.taxinfo.find_one({'_id': id_str})
        print(entry)
        return entry["wage_card"]
        return {"image": "static/Lohn_Lohnausweis.jpg",
                "height": 1,
                "width": 2,
                "highlights": [
                    {"x": 0, "y": 0, "height": 100, "width": 100, "name": "💩", "id": "1"},
                    {"x": 169, "y": 242, "height": 69, "width": 96, "name": "No heck No Sneck! 🐍", "id": "2"},
                ]
                }

    @app.route("/entry/<id>", methods=['PUT'])
    def update_entry():
        return {"status": "ok!"}

    @app.route("/info", methods=['GET'])
    def info():
        return {
            "deductions": [{"name": "Studienkosten", "value": 1200, "maxDeduction": 12000},
                           {"name": "Transport", "value": 69, "maxDeduction": 420}],
            "income": [{"name": "Lohn", "value": 10000}, {"name": "Zins Sparkonto", "value": 100}],
            "capital": [{"name": "Sparkonto", "value": 69000}]
        }

    @app.route("/deductions", methods=['GET'])
    def deductions():
        return {
            "categories": [
                {
                    "name": "Ausbildung",
                    "maxDeduction": 12000,
                    "currentDeduction": 8041,
                    "entries":
                    [
                        {
                            "name": "Kosten Uni",
                            "value": 10000,
                        },
                        {
                            "name": "Buch XY",
                            "value": 41
                        }
                    ]
                },
                {
                    "name": "Kinder",
                    "currentDeduction": 1000
                }
            ]
        }

    @app.route('/static/<path:path>')
    def send_static(path):
        return send_from_directory('static', path)
    return app
