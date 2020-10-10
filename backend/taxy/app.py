import os

from pathlib import Path
from http import HTTPStatus
from random import random, randrange
import requests
from bson.json_util import dumps

from copy import deepcopy
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


deduction_categories = {
            "categories":
            [
                {"type": "kids", "displayName": "Kinder", "color": "#00C49F", "icon": "child", "maxDeduction": 6942},
                {"type": "study", "displayName": "Ausbildung", "color": "#0088FE", "icon": "school", "maxDeduction": 1234},
                {"type": "3a", "displayName": "3a", "color": "#FF8042", "icon": "poll", "maxDeduction": 6510},
            ]
        }

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
        # uploaded_file.save(str(target_file))

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
        category =  deduction_categories['categories'][randrange(start=0, stop=2)]["type"] #hack
        inserted_id = current_app.mongo.db.taxinfo.insert_one({
            "user": user_session,
            "entry":
            {
                "file":  str(target_file),
                "width": width,
                "height": height,
                "type": result[0],
                "content": result[1]
            },
            "deductionCategory": category #hack
        }).inserted_id

        return dumps({"id": inserted_id}), HTTPStatus.CREATED


    @app.route("/entry/<ObjectId:object_id>", methods=['GET'])
    def entry(object_id):
        entry = current_app.mongo.db.taxinfo.find_one({'_id': object_id})
        print(entry)
        return entry["entry"]

    @app.route("/entry/<ObjectId:object_id>", methods=['PUT'])
    def update_entry(object_id):
        response = current_app.mongo.db.taxinfo.update({'_id': object_id}, {"$set": {'entry': request.get_json()}})
        return response

    def __get_entry_info(user_session):
        entries = current_app.mongo.db.taxinfo.find({'user':user_session})
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
                        income.append({"name": e["file"], "value": marker["value"], "id": str(entry["_id"])})

            elif entry_type == "interest_statement":
                iban =""
                value =""
                for marker in e["content"]:
                    if marker["name"] == "amount":
                        value = marker["value"]
                    if marker["name"] == "intrests":
                        capital.append({"name": e["file"], "value": marker["value"], "id": str(entry["_id"])})
                    if marker["name"] == "iban":
                        iban = marker["value"]
                income.append({"name": iban, "value": value, "id": str(entry["_id"])})
        for i in income:
            total_income += i["value"]
        for c in capital:
            total_capital += c["value"]
        return {
            "income": income,
            "totalIncome": total_income,
            "totalCapital": total_capital,
            "capital": capital
        }

    @app.route("/deduction_categories", methods=['GET'])
    def get_deduction_categories():
        return deduction_categories

    @app.route("/info", methods=['GET'])
    def info():
        user_session = request.cookies.get('_taxy_session', 0)

        return __get_entry_info(user_session)

    @app.route("/deductions", methods=['GET'])
    def deductions():
        dedus = deepcopy(deduction_categories)
        for ded in dedus["categories"]:
            ded["entries"] = []
            ded["currentDeduction"] = 0
        entries = current_app.mongo.db.taxinfo.find({'user': 0})
        for entry in entries:
            e = entry["entry"]
            entry_type = e["type"]
            if entry_type == "bill":
                for marker in e["content"]:
                    if marker["name"] == "amount":
                        for cat in dedus["categories"]:
                            if "deductionCategory" in e.keys():
                                if cat["type"] == e["deductionCategory"]:
                                    cat["entries"].append({"name": e["file"], "value": marker["value"], "id": str(entry["_id"])})
                                    cat["currentDeduction"]+= marker["value"]
        return dedus

    @app.route("/calculate-taxes")
    def calculate_taxes():
        user_session = request.cookies.get('_taxy_session', 0)

        infos = __get_entry_info(user_session)
        #dedus = deductions()
        #_3as = dedus["categories"][2]["entries"]
        #total_3a = sum(a["value"] for a in _3as)

        #data = '{"SimKey":null,"TaxYear":2019,"TaxLocationID":630000000,"Relationship":1,"Confession1":5,"Children":[],"Age1":24,"RevenueType1":1,"Revenue1":60000,"Fortune":150000,"Confession2":0,"Age2":0,"RevenueType2":0,"Revenue2":0,"Budget":[]}'
        #data = '{"SimKey":null,"TaxYear":2019,"TaxLocationID":630000000,"Relationship":1,"Confession1":5,"Children":[],"Age1":25,"RevenueType1":1,"Revenue1":60000,"Fortune":150000,"Confession2":0,"Age2":0,"RevenueType2":0,"Revenue2":0,"Budget":[]}'

        data = f'{{"SimKey":null,"TaxYear":2019,"TaxLocationID":630000000,"Relationship":1,"Confession1":5,"Children":[],"Age1":25,"RevenueType1":2,"Revenue1":{infos["totalIncome"]},"Fortune":{infos["totalCapital"]},"Confession2":0,"Age2":0,"RevenueType2":0,"Revenue2":0,"Budget":[]}}'
        #data = f'{{"SimKey":null,"TaxYear":2019,"TaxLocationID":630000000,"Relationship":1,"Confession1":5,"Children":[],"Age1":35,"RevenueType1":2,"Revenue1":{infos["totalIncome"]},"Fortune":{infos["totalCapital"]},"Confession2":0,"Age2":0,"RevenueType2":0,"Revenue2":0,"Budget":[{{"Ident":"NEBENERWERB_P1","Value":0,"Show":true,"Main":1,"Name":{{"DE":"Nettolohn Nebenerwerb","EN":"","ID":"TXT_NEBENERWERB_P1","IT":"","FR":"Revenu complémentaire net"}}}},{{"Ident":"MIETERTRAG","Value":0,"Show":true,"Main":1,"Name":{{"DE":"Eigenmietwert und Mieterträge","EN":"","ID":"TXT_MIETERTRAG","IT":"","FR":"Valeur locative et revenus locatifs"}}}},{{"Ident":"UEBRIGESEK","Value":0,"Show":true,"Main":1,"Name":{{"DE":"Übrige Einnahmen","EN":"","ID":"TXT_UEBRIGESEK","IT":"","FR":"Autres revenus"}}}},{{"Ident":"VMERTRAEGE","Value":0,"Show":true,"Main":1,"Name":{{"DE":"Vermögenserträge","EN":"","ID":"TXT_VMERTRAEGE","IT":"","FR":"Revenus des titres"}}}},{{"Ident":"BETEILIGUNG","Value":0,"Show":true,"Main":1,"Name":{{"DE":"davon aus Beteiligungen","EN":"","ID":"TXT_BETEILIGUNG","IT":"","FR":"part en participations"}}}},{{"Ident":"KKPRAEMIEN","Value":4560,"Show":true,"Main":2,"Name":{{"DE":"Krankenkassenprämien","EN":"","ID":"TXT_KKPRAEMIEN","IT":"","FR":"Primes d\'assurance maladie"}}}},{{"Ident":"IPVEXTRA","Value":0,"Show":true,"Main":2,"Name":{{"DE":"Individuelle Prämienverbilligung","EN":"","ID":"TXT_IPVEXTRA","IT":"","FR":"Réduction de prime individuelle"}},{{"Ident":"PRAEMIEN3A","Value":{total_3a},"Show":true,"Main":2,"Name":{{"DE":"Beiträge an Säule 3a","EN":"","ID":"TXT_PRAEMIEN3A","IT":"","FR":"Contributions pilier 3a"}}}},{{"Ident":"VERPFLEGUNG_P1","Value":0,"Show":true,"Main":2,"Name":{{"DE":"Verpflegungskosten","EN":"","ID":"TXT_VERPFLEGUNG_P1","IT":"","FR":"Frais de restauration"}}}},{{"Ident":"FAHRKOSTEN_P1","Value":0,"Show":true,"Main":2,"Name":{{"DE":"Fahrkosten","EN":"","ID":"TXT_FAHRKOSTEN_P1","IT":"","FR":"Frais de déplacement"}}}},{{"Ident":"BERUFSKOSTEN_P1","Value":0,"Show":true,"Main":2,"Name":{{"DE":"Übrige Berufsauslagen","EN":"","ID":"TXT_BERUFSKOSTEN_P1","IT":"","FR":"Autres frais professionnels"}}}},{{"Ident":"BERUFSAUSLAGEN_NE_P1","Value":0,"Show":true,"Main":2,"Name":{{"DE":"Berufsauslagen Nebenerwerb","EN":"","ID":"TXT_BERUFSAUSLAGEN_NE_P1","IT":"","FR":"Frais prof. revenu compl."}}}},{{"Ident":"MIETAUSGABEN","Value":15000,"Show":true,"Main":2,"Name":{{"DE":"Mietausgaben","EN":"","ID":"TXT_MIETAUSGABEN","IT":"","FR":"Frais de location"}}}},{{"Ident":"SCHULDZINSEN","Value":0,"Show":true,"Main":2,"Name":{{"DE":"Schuldzinsen","EN":"","ID":"TXT_SCHULDZINSEN","IT":"","FR":"Intérêts des dettes"}}}},{{"Ident":"IMMOUNTERHALT","Value":0,"Show":true,"Main":2,"Name":{{"DE":"Unterhaltskosten Immobilien","EN":"","ID":"TXT_IMMOUNTERHALT","IT":"","FR":"Frais d\'entretient d\'immeubles"}}}},{{"Ident":"UEBRIGEABZUEGE","Value":0,"Show":true,"Main":2,"Name":{{"DE":"Übrige Abzüge","EN":"","ID":"TXT_UEBRIGEABZUEGE","IT":"","FR":"Autres déductions"}}}},{{"Ident":"NETTO_VM","Value":{infos["totalCapital"]},"Show":true,"Main":3,"Name":{{"DE":"Reinvermögen","EN":"","ID":"TXT_NETTO_VM","IT":"","FR":"Fortune nette"}}}},{{"Ident":"NETTOLOHN_P1","Value":{infos["totalIncome"]},"Show":false,"Main":1,"Name":{{"DE":"Nettolohn","EN":"","ID":"TXT_NETTOLOHN_P1","IT":"","FR":"Revenu net"}}}}]}}'
        print(data)
        request_url = "https://swisstaxcalculator.estv.admin.ch/delegate/ost-integration/v1/lg-proxy/operation/c3b67379_ESTV/API_calculateDetailedTaxes"
        resp = requests.post(request_url, data=data, headers={"Content-Type": "application/json"})
        if not resp.ok:
            print(resp.__dict__)
            return {"message": "Could not calculate taxes"}, HTTPStatus.INTERNAL_SERVER_ERROR

        json_resp = resp.json()["response"]
        print(json_resp)
        canton = json_resp["IncomeTaxCanton"]
        city = json_resp["IncomeTaxCity"]
        fed = json_resp["IncomeTaxFed"]

        return {
            "canton": canton,
            "city": city,
            "fed": fed,
            "total": canton + city + fed
        }

    @app.route('/static/<path:path>')
    def send_static(path):
        return send_from_directory('static', path)


    @app.route('/data/<path:path>')
    def send_data(path):
        return send_from_directory(os.path.join('..', 'data'), path)

    return app
