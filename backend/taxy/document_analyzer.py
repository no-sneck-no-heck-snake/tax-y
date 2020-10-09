import re
from PIL import Image
import pytesseract
from pdf2image import convert_from_path

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

DOCUMENT_DATA_EXTRACTOR = {
    DocumentType.WAGE_CARD: lambda content: {
        "amount": int(re.compile(r"nettolohn(.|\n)*?((\d|')+)", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0][1].replace("'", "")),
    },
    DocumentType.INTEREST_STATEMENT: lambda content: {
        # match the saldo
        "amount": float(re.compile(r"saldo(.|\n)*?((\d|'|)+\.\d\d)$", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0][1].replace("'", "")),
        # match the zins
        "interest": float(re.compile(r"habenzins(.|\n)*?((\d|'|)+\.\d\d)$", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0][1].replace("'", "")),
        "year": re.compile(r"31\.12\.(\d{2,4})", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0]
    },
    #DocumentType.INSURACNCE_STATMENT = 3
    DocumentType.BILL: lambda content: {
        "amount": float(re.compile(r"(end|gesamt|schluss)betrag(.)*?((\d|'|)+\.\d\d)$", flags=re.IGNORECASE|re.MULTILINE).findall(content)[0][2].replace("'", ""))
    }
}


def classify_document(document_content):
    """
    Classifies what a the type of an upploaded document is
    """
    for classifyer in DOCUMENT_CLASSIFYER:
        if DOCUMENT_CLASSIFYER[classifyer](document_content):
            return (classifyer.value, DOCUMENT_DATA_EXTRACTOR[classifyer](document_content))


def scan_document(document_path):

    if document_path.suffix == ".pdf":
        images = convert_from_path(str(document_path))
    else:
        images = [Image.open(str(document_path))]

    # Simple image to string
    result = "".join(pytesseract.image_to_string(image, lang='deu') for image in images)
    print(result)
    return classify_document(result)
