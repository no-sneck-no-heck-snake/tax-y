from PIL import Image
import pytesseract
from pdf2image import convert_from_path

from enum import Enum

class DocumentType(Enum):
    WAGE_CARD = 1
    INTEREST_STATEMENT = 2
    INSURACNCE_STATMENT = 3
    BILL = 4

DOCUMENT_CLASSIFYER = {
    DocumentType.WAGE_CARD: lambda content: "Lohnausweis" in content
    #DocumentType.INTEREST_STATEMENT: lambda c: pass
    #DocumentType.INSURACNCE_STATMENT = 3
    #DocumentType.BILL = 4
}

DOCUMENT_DATA_EXTRACTOR = {
    DocumentType.WAGE_CARD: lambda content: re.compile(r"Nettolohn.*?(\d+)").findall(content)
    #DocumentType.INTEREST_STATEMENT = 2
    #DocumentType.INSURACNCE_STATMENT = 3
    #DocumentType.BILL = 4
    
}


def classify_document(document_content):
    """
    Classifies what a the type of an upploaded document is
    """
    for classifyer in DOCUMENT_CLASSIFYER:
        if DOCUMENT_CLASSIFYER[classifyer](content):
            return DOCUMENT_DATA_EXTRACTOR[classifyer](content)



def scan_document(document_path):

    if document_path.suffix == ".pdf":
        images = convert_from_path(str(document_path))
    else:
        images = [Image.open(str(document_path))]

    # Simple image to string
    result = "".join(pytesseract.image_to_string(image, lang='deu') for image in images)
    print(result)
    return result
