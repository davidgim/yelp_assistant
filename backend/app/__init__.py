from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')
    db.init_app(app)
    api = Api(app)

    CORS(app)

    from .routes import initialize_routes
    initialize_routes(api)

    return app