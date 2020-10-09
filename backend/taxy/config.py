MONGO_URI = os.environ.get("DB", "mongodb://localhost/taxy")
UPLOAD_FOLDER = Path(os.getenv("UPLOAD_FOLDER", "data"))