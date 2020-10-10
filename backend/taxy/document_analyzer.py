import re
import spacy

from PIL import Image
import pytesseract
from pdf2image import convert_from_path
from collections import Counter

from enum import Enum

class DocumentType(Enum):
    WAGE_CARD = "wage_card"
    INTEREST_STATEMENT = "interest_statement"
    INSURACNCE_STATMENT = "insurance_statment"
    BILL = "bill"

DOCUMENT_CLASSIFYER = {
    DocumentType.WAGE_CARD: lambda content: "lohnausweis" in content.lower(),
    DocumentType.INTEREST_STATEMENT: lambda content: "zins" in content.lower() and "saldo" in content.lower(),
    DocumentType.INSURACNCE_STATMENT: lambda content: False,
    DocumentType.BILL: lambda content: "rechnung" in content.lower()
} 


def __get_match(content, indexes, name, data_extractor):
    entry = {"x": 0, "y": 0, "height": 0, "width": 0}

    try:
        match, original_match = data_extractor(content)

        match_index = indexes["text"].index(original_match)
        return {
            "height": indexes["height"][match_index],
            "width": indexes["width"][match_index],
            "top": indexes["top"][match_index],
            "left": indexes["left"][match_index],
            "name" :name,
            "value": match
        }
            
    except:
        return {
            "height": 0,
            "width": 0,
            "top": 0,
            "left": 0,
            "value": 0,
            "name": name
        }  # well we fucked up (╯°□°)╯︵ ┻━┻"""

def __wage_data_extractor(content):
    original_match = re.compile(r"nettolohn(.|\n)*?((\d|')+)", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0][1].strip()
    match = int(original_match.replace("'", ""))
    return match, original_match

def __interest_amount_data_extractor(content):
    original_match = re.compile(r"saldo(.|\n)*?((\d|'|\s)+\.\d\d)$", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0][1].strip()
    match = float(original_match.replace(" ", "").replace("'", ""))
    return match, original_match.split(" ")[-1]

def __interest_data_extractor(content):
    original_match = re.compile(r"habenzins(.|\n)*?((\d|'|)+\.\d\d)$", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0][1].strip()
    match = float(original_match.replace("'", ""))
    return match, original_match

def __year_data_extractor(content):
    m = re.compile(r"31\.12\.(\d{2,4})", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0]
    return m, f"31.12.{m}"

def __bill_data_extractor(content):
    original_match = re.compile(r"(end|gesamt|schluss)betrag(.)*?((\d|'|)+\.\d\d)$", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0][2].strip()
    match = float(original_match.replace("'", ""))
    return match, original_match

def __iban_extractor(content):
    m = re.compile(r"(CH\d{2}\s\d{4}\s\d{4}\s\d{4}\s?\w{4}\s?\w)", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0].strip()
    return m, m.split(" ")[0]


def __get_product_match(content):
    nlp = spacy.load("de_core_news_md")
    doc = nlp(content)

    # Analyze syntax
    print("Noun phrases:", [chunk.text for chunk in doc.noun_chunks])
    print("Verbs:", [token.lemma_ for token in doc if token.pos_ == "VERB"])

    # Find named entities, phrases and concepts
    comp = []
    for entity in doc.ents:
        print(entity.text, entity.label_)
        if entity.label_ == "ORG":
            comp.append(entity.text)

    #print([(X, X.ent_iob_, X.ent_type_) for X in doc])
    print(comp)
    return "asdfsdf"

DOCUMENT_DATA_EXTRACTOR = {
    DocumentType.WAGE_CARD: lambda content, indexes: [
        __get_match(content, indexes, "amount", __wage_data_extractor)
    ],
    DocumentType.INTEREST_STATEMENT: lambda content, indexes: [
        __get_match(content, indexes, "amount", __interest_amount_data_extractor),
        __get_match(content, indexes, "interest", __interest_data_extractor),
        __get_match(content, indexes, "year", __year_data_extractor),
        __get_match(content, indexes, "iban", __iban_extractor)
    ],
    #DocumentType.INSURACNCE_STATMENT = 3
    DocumentType.BILL: lambda content, indexes: [
        __get_match(content, indexes, "amount", __bill_data_extractor)
    ]
}


def classify_document(document_content, indexes):
    """
    Classifies what a the type of an upploaded document is
    """
    # __get_product_match(document_content)

    for classifyer in DOCUMENT_CLASSIFYER:
        if DOCUMENT_CLASSIFYER[classifyer](document_content):
            result = (classifyer.value, DOCUMENT_DATA_EXTRACTOR[classifyer](document_content, indexes))
            print(result)
            return result


def scan_document(image):
    # Simple image to string
    text_result = pytesseract.image_to_string(image, lang='deu')
    indexes = pytesseract.image_to_data(image, lang="deu", output_type=pytesseract.Output.DICT)
    #FIXME: ? text_result = " ".join(indexes["text"])
    print(text_result)
    return classify_document(text_result, indexes)
