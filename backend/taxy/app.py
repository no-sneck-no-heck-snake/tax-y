import os

from pathlib import Path
from http import HTTPStatus

from flask import Flask, jsonify, request, current_app
from flask.helpers import send_from_directory
from flask_pymongo import PyMongo
from pdf2image import convert_from_path, convert_from_bytes
from flask_cors import CORS
from pymongo import ReturnDocument
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

        #target_file = base_path / (str(uuid4()) + Path(uploaded_file.filename).suffix)
        #uploaded_file.save(str(target_file))

        if Path(uploaded_file.filename).suffix == ".pdf":
            some_image = convert_from_bytes(uploaded_file.read())[0]
            target_file = base_path / (str(uuid4()) + ".jpg")
            some_image.save(str(target_file), 'JPEG')
        else:
            target_file = base_path / (str(uuid4()) + Path(uploaded_file.filename).suffix)
            uploaded_file.save(str(target_file))
            some_image = Image.open(str(uploaded_file.filename))

        result = scan_document(some_image)

        print(f'Saved file at: {target_file}')
        if not current_app.mongo.db.users.find_one({"_id": user_session}):
            if int(user_session) == 0:
                traits = ["student", "with_children", "married", "senior"] 
            current_app.mongo.db.users.insert({
                "_id": user_session, "traits": traits
            })

        width, height = Image.open(str(target_file)).size

        current_app.mongo.db.taxinfo.insert({
            "user": user_session,
            "entry":
            {
                "file":  str(target_file),
                "width": width,
                "height": height,
                "type": result[0],
                "content": result[1]
            }
        })

        return {"content": result}, HTTPStatus.CREATED

    @app.route("/entry/<ObjectId:object_id>", methods=['GET'])
    def entry(object_id):
        entry = current_app.mongo.db.taxinfo.find_one({'_id': object_id})
        return entry["entry"]

    @app.route("/entry/<ObjectId:object_id>", methods=['PUT'])
    def update_entry(object_id):
        response = current_app.mongo.db.taxinfo.update({'_id': object_id}, {"$set":{'entry':request.get_json()}})
        return response

    @app.route("/info", methods=['GET'])
    def info():
        entries = current_app.mongo.db.taxinfo.find({'user':0})
        deductions = []
        income = []
        total_income = 0
        total_capital = 0
        capital = []
        for entry in entries:
            e = entry["entry"]
            entry_type = e["type"]
            if entry_type == "wage_card":
                for marker in e["content"]:
                    if marker["name"] == "amount":
                        income.append({"name": e["file"], "value": marker["value"]})

            elif entry_type == "bill":
                for marker in e["content"]:
                    if marker["name"] == "amount":
                        deductions.append({"name": e["file"], "value": marker["value"]})   

            elif entry_type == "interest_statement":
                for marker in e["content"]:
                    if marker["name"] == "amount":
                        capital.append({"name": e["file"], "value": marker["value"]})    
                    if marker["name"] == "intrests":
                        income.append({"name": e["file"], "value": marker["value"]})
        for i in income:
            total_income+= i["value"]
        for c in capital:
            total_capital += c["value"]
        return {
            "deductions": deductions,
            "income": income,
            "total_income": total_income,
            "total_capital": total_capital,
            "capital": capital
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
                    "currentDeduction": 3000
                },
                {
                    "name": "3a",
                    "maxDeduction": 6590,
                    "currentDeduction": 2340,
                    "entries":
                    [
                        {
                            "name": "Fondsparplan",
                            "value": 1000,
                        },
                        {
                            "name": "Sparkonto",
                            "value": 1340,
                        }
                    ]
                },
            ]
        }

    @app.route('/static/<path:path>')
    def send_static(path):
        return send_from_directory('static', path)

    @app.route('/data/<path:path>')
    def send_data(path):
        return send_from_directory(os.path.join('..','data'), path)

    return app