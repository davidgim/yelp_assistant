from flask_restful import Resource, reqparse
from app.models import Location
from flask import request, current_app
from functools import lru_cache
from sqlalchemy import func
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class States(Resource):
    @lru_cache(maxsize=1)
    def get_states():
        logger.info("Fetching states from database")
        states = Location.query.with_entities(Location.state).distinct().order_by(Location.state).all()
        logger.info(f"Found {len(states)} states")
        return [state[0] for state in states]

    def get(self):
        logger.info("Received request for states")
        try:
            result = States.get_states()
            logger.info("Successfully returned states")
            return result
        except Exception as e:
            logger.error(f"Error fetching states: {str(e)}")
            return {"error": str(e)}, 500

class Cities(Resource):
    def get(self):
        logger.info("Received request for cities")
        parser = reqparse.RequestParser()
        parser.add_argument('state', type=str, location='args')
        args = parser.parse_args()

        try:
            query = Location.query.with_entities(Location.city).distinct()
            if args['state']:
                logger.info(f"Filtering cities by state: {args['state']}")
                query = query.filter(Location.state == args['state'])
            cities = query.order_by(Location.city).all()
            logger.info(f"Found {len(cities)} cities")
            return [city[0] for city in cities]
        except Exception as e:
            logger.error(f"Error fetching cities: {str(e)}")
            return {"error": str(e)}, 500

class Locations(Resource):
    def get(self):
        logger.info("Received request for locations")
        try:
            # Get pagination parameters
            page = request.args.get('page', 1, type=int)
            per_page = request.args.get('per_page', 50, type=int)
            
            # Check if client is requesting all records (per_page=0 or very large)
            get_all = per_page == 0 or per_page > 1000
            if get_all:
                logger.info("Client requested all locations (no pagination)")
            else:
                per_page = min(per_page, 100)  # Cap at 100 if using pagination
                logger.info(f"Pagination: page={page}, per_page={per_page}")
            
            # Get filter parameters
            state = request.args.get('state', type=str)
            city = request.args.get('city', type=str)
            
            # Build query
            query = Location.query
            
            if state:
                logger.info(f"Filtering by state: {state}")
                query = query.filter(Location.state == state)
            if city:
                logger.info(f"Filtering by city: {city}")
                query = query.filter(Location.city.ilike(f"%{city}%"))
                
            # Get total count for pagination
            logger.info("Counting total records")
            total = query.count()
            logger.info(f"Total records: {total}")
            
            # Apply pagination or get all
            logger.info("Fetching locations")
            if get_all:
                locations = query.order_by(Location.state, Location.city).all()
                page = 1
                per_page = total
            else:
                locations = query.order_by(Location.state, Location.city)\
                    .offset((page - 1) * per_page)\
                    .limit(per_page)\
                    .all()
                
            logger.info(f"Retrieved {len(locations)} locations")
                
            return {
                'locations': [{'state': loc.state, 'city': loc.city} for loc in locations],
                'total': total,
                'page': page,
                'per_page': per_page,
                'total_pages': 1 if get_all else (total + per_page - 1) // per_page
            }
        except Exception as e:
            logger.error(f"Error fetching locations: {str(e)}")
            return {"error": str(e)}, 500