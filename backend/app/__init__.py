from flask import Flask, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from dotenv import load_dotenv
from flask_cors import CORS
import os

load_dotenv()

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    
    # Using environment variables directly instead of config file
    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-key')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Add database timeout settings
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        'pool_timeout': 30,  # Seconds to wait on pool checkout
        'pool_recycle': 1800,  # Recycle connections after 30 minutes
        'pool_pre_ping': True,  # Enable connection health checks
        'connect_args': {
            'connect_timeout': 10  # Timeout for initial connection
        }
    }
   
    db.init_app(app)
    api = Api(app)
    
    # Set up CORS with allowed origins
    allowed_origins = [
        'http://localhost:4200',  # Local development
        os.getenv('FRONTEND_URL', ''),  # Primary frontend URL
        os.getenv('FRONTEND_ALT_URL', '')  # Alternative frontend URL (Firebase provides two)
    ]
    # Filter out empty strings
    allowed_origins = [origin for origin in allowed_origins if origin]
    
    CORS(app, resources={r"/*": {"origins": allowed_origins}})
    
   
    @app.route('/')
    @app.route('/health')
    def health_check():
        return jsonify({'status': 'ok'})

    from .auth import AuthError

    @app.errorhandler(AuthError)
    def handle_auth_error(error):
        response = jsonify({'message': error.message})
        response.status_code = error.status_code
        return response

    from .routes import initialize_routes
    initialize_routes(api)

    return app