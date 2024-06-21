import os

class Config:

    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')  
    SQLALCHEMY_TRACK_MODIFICATIONS = False  

   
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY') 

    GROQ_API_KEY = os.getenv('GROQ_API_KEY')
    DEBUG = os.getenv('FLASK_DEBUG', True)

    AUTH0_DOMAIN = os.getenv('AUTH0_DOMAIN')
    AUTH0_CLIENT_ID = os.getenv('AUTH0_CLIENT_ID')
    AUTH0_CLIENT_SECRET = os.getenv('AUTH0_CLIENT_SECRET')
    AUTH0_API_AUDIENCE = os.getenv('API_IDENTIFIER')
