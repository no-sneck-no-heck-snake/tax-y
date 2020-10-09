app:
	docker-compose up --build

local:
	pipenv install
	FLASK_APP=taxy pipenv run flask run --host 0.0.0.0

docker:
	docker build -t taxy-backend .
	docker run -p 8000:8000 taxy-backend
