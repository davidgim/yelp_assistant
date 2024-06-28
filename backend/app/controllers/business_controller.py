from flask_restful import Resource, reqparse
from app.models import Business, Review
from flask import request
import re
from app.utils import clean_text, get_summary, get_management_api_token, get_user_metadata

class SearchBusiness(Resource):
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

class SummarizeBusiness(Resource):
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('businessId', type=str, required=True)
        parser.add_argument('userId', type=str, required=False)
        args = parser.parse_args()

        business = Business.query.get(args['businessId'])
        if not business:
            return {'message': 'Business not found'}, 404

        reviews = Review.query.filter_by(business_id=args['businessId']).order_by(Review.useful.desc()).limit(5).all()
        if not reviews:
            return {'message': 'No reviews found for this business'}, 404
        

        review_texts = " ".join([clean_text(review.text) for review in reviews])

        dietary_restrictions = None

        if args['userId']:
            token = get_management_api_token()
            user_metadata = get_user_metadata(args['userId'], token)
            dietary_restrictions = user_metadata.get('dietary_restrictions')

        summary = get_summary(business, review_texts, dietary_restrictions)

        return {'summary': summary}

class BusinessCategories(Resource):
    def get(self):
        categories = Business.query.with_entities(Business.categories).distinct().all()
        unique_categories = set()
        for category_list in categories:
            if category_list[0]:
                unique_categories.update(category_list[0])
        return list(unique_categories)

class BusinessInformation(Resource):
    def get(self):
        business_id = request.args.get('business_id')

        if not business_id:
            return {'message': 'Business ID is required'}, 400

        business = Business.query.get(business_id)

        serialized_business = business.serialize()
        return serialized_business