from flask import jsonify, request
from flask_restful import Resource
from app.models import db
import http.client
import json
import os
from app.utils import get_management_api_token, get_user_metadata

    
class GetUserMetadata(Resource):
    def get(self):
        user_id = request.args.get('user_id')

        if not user_id:
            return {'message': 'User ID is required'}, 400
        
        print("AFTER RETURN")
        access_token = get_management_api_token()


        token = get_management_api_token()
        user_metadata = get_user_metadata(user_id, token)

        return jsonify(user_metadata)
    
        conn = http.client.HTTPSConnection(os.getenv('AUTH0_DOMAIN'))

        headers = {
            'content-type': "application/json",
            'authorization': f"Bearer {access_token}"
        }

        conn.request("GET", f"/api/v2/users/{user_id}", headers=headers)
        res = conn.getresponse()
        data = res.read().decode("utf-8")
        user_info = json.loads(data)

        user_metadata = user_info.get('user_metadata', {})
        return jsonify(user_metadata)
    
class UpdateUserMetadata(Resource):
    def patch(self):
        data = request.get_json()
        user_id = data.get('user_id')
        if not user_id:
            return jsonify({"message": "User ID is required"}), 400
        
        access_token = get_management_api_token()

        conn = http.client.HTTPSConnection(os.getenv('AUTH0_DOMAIN'))
        headers = {
            'authorization': f'Bearer {access_token}',
            'content-type': 'application/json'
        }

        payload = json.dumps({
            "user_metadata": {
                "dietary_restrictions": data.get('dietary_restrictions', []),
                "favorite_businesses": data.get('favorite_businesses', [])
            }
        })

        conn.request("PATCH", f"/api/v2/users/{user_id}", payload, headers)
        res = conn.getresponse()
        data = res.read()

        if res.status == 200:
            return jsonify({"message": "User metadata updated successfully"})
        else:
            return jsonify({"message": "Failed to update user metadata", "error": data.decode("utf-8")})
        
class UpdateUserFavoriteBusinesses(Resource):
    def patch(self):
        user_id = request.json.get('user_id')
        new_favorite = request.json.get('new_favorite')

        if not user_id or not new_favorite:
            return "User ID and New Favorite Required", 400
        
        token = get_management_api_token()
        conn = http.client.HTTPConnection(os.getenv('AUTH0_DOMAIN'))
        payload = json.dumps({
            "user_metadata": {
                "favorite_businesses": new_favorite
            }
        })

        headers = {
            'content-type': "application/json",
            'authorization': f"Bearer {token}"
        }

        conn.request("PATCH", f"/api/v2/users/{user_id}", payload, headers)
        res = conn.getresponse()
        data = res.read()
        return jsonify(json.loads(data.decode("utf-8")))
        
