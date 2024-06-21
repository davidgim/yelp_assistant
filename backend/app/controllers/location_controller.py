from flask_restful import Resource, reqparse
from app.models import Location

class States(Resource):
    def get(self):
        states = Location.query.with_entities(Location.state).distinct().all()
        return [state[0] for state in states]

class Cities(Resource):
    def get(self):
        parser = reqparse.RequestParser()
        parser.add_argument('state', type=str, location='args')
        args = parser.parse_args()

        query = Location.query.with_entities(Location.city).distinct()
        if args['state']:
            query = query.filter(Location.state.ilike(f"%{args['state']}%"))
        cities = query.all()
        return [city[0] for city in cities]

class Locations(Resource):
    def get(self):
        locations = Location.query.all()
        return [{'state': location.state, 'city': location.city} for location in locations]