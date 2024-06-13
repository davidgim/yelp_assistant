import os
from openai import OpenAI
from flask_restful import Resource, reqparse
from .models import Business, Review, Location
import re

client = OpenAI()

def initialize_routes(api):
    api.add_resource(SearchApi, '/api/search')
    api.add_resource(SummarizeApi, '/api/summarize')
    api.add_resource(StatesApi, '/api/states')
    api.add_resource(CitiesApi, '/api/cities')
    api.add_resource(CategoriesApi, '/api/categories')
    api.add_resource(LocationsApi, '/api/locations')

class SearchApi(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('city', type=str, location='args')
        parser.add_argument('state', type=str, location='args')
        parser.add_argument('category', type=str, location='args')
        parser.add_argument('businessName', type=str, location='args')
        args = parser.parse_args()

        query = Business.query
        if args['state']:
            query = query.filter(Business.state.ilike(f"%{args['state']}%"))
        if args['city']:
            query = query.filter(Business.city.ilike(f"%{args['city']}%"))
        if args['category']:
            query = query.filter(Business.categories.any(args['category']))
        if args['businessName']:
            query = query.filter(Business.name.ilike(f"%{args['businessName']}%"))

        businesses = query.all()
        return [business.serialize() for business in businesses]
    
class SummarizeApi(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('businessId', type=str, required=True)
        args = parser.parse_args()

        business = Business.query.get(args['businessId'])
        if not business:
            return {'message': 'Business not found'}, 404
        
        reviews = Review.query.filter_by(business_id = args['businessId']).order_by(Review.useful.desc()).limit(2).all()
        if not reviews:
            return {'message': 'No reviews found for this business'}, 404
        
        review_texts = " ".join([clean_text(review.text) for review in reviews])
        summary = get_summary(business, review_texts)

        return {'summary': summary}

class StatesApi(Resource):
    def get(self):
        states = Location.query.with_entities(Location.state).distinct().all()
        return [state[0] for state in states]

class CitiesApi(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('state', type=str, location='args')
        args = parser.parse_args()

        query = Location.query.with_entities(Location.city).distinct()
        if args['state']:
            query = query.filter(Location.state.ilike(f"%{args['state']}%"))
        cities = query.all()
        return [city[0] for city in cities]

class CategoriesApi(Resource):
    def get(self):
        categories = Business.query.with_entities(Business.categories).distinct().all()
        unique_categories = set()
        for category_list in categories:
            if category_list[0]:
                unique_categories.update(category_list[0])
        return list(unique_categories)
    
class LocationsApi(Resource):
    def get(self):
        locations = Location.query.all()
        return [{'state': location.state, 'city': location.city} for location in locations]

    
def clean_text(text):
        return re.sub(r'\s+', ' ', text).strip()

def get_summary(business, reviews):
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a helpful assistant designed to output JSON."},
            {"role": "user", "content": f"Provide a concise and readable summary that highlights the most important or repeated aspects of the following reviews for {business.name}: {reviews}"}
        ]
    )
    summary = response.choices[0].message.content
    return summary