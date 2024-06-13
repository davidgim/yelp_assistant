import os

class Config:

    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')  
    SQLALCHEMY_TRACK_MODIFICATIONS = False  

   
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY') 

    
    DEBUG = os.getenv('FLASK_DEBUG', True)
