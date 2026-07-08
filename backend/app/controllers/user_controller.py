from flask import jsonify, request, g
from flask_restful import Resource
from app.utils import get_management_api_token, get_user_metadata
from app.auth import requires_auth


class GetUserMetadata(Resource):
    @requires_auth
    def get(self):
        token = get_management_api_token()
        user_metadata = get_user_metadata(g.user_id, token)
        return jsonify(user_metadata)


class AddUserDietaryRestriction(Resource):
    @requires_auth
    def patch(self):
        new_restriction = request.json.get('new_restriction')

        if not new_restriction:
            return "New Restriction Required", 400

        token = get_management_api_token()
        current_restrictions = get_user_metadata(g.user_id, token).get('dietary_restrictions', [])

        if new_restriction not in current_restrictions:
            current_restrictions.append(new_restriction)
            updated = _patch_user_metadata(g.user_id, token, {'dietary_restrictions': current_restrictions})
            return jsonify(updated)

        return "User already has given dietary restriction", 409


class AddUserFavoriteBusiness(Resource):
    @requires_auth
    def patch(self):
        new_favorite = request.json.get('new_favorite')

        if not new_favorite:
            return "New Favorite Required", 400

        token = get_management_api_token()
        current_favorites = get_user_metadata(g.user_id, token).get('favorite_businesses', [])

        if isinstance(current_favorites, dict):
            current_favorites = [current_favorites]

        current_favorites.append(new_favorite)
        updated = _patch_user_metadata(g.user_id, token, {'favorite_businesses': current_favorites})
        return jsonify(updated)


class DeleteUserFavoriteBusiness(Resource):
    @requires_auth
    def patch(self):
        to_delete = request.json.get('to_delete')

        if not to_delete:
            return "Favorite Required", 400

        token = get_management_api_token()
        current_favorites = get_user_metadata(g.user_id, token).get('favorite_businesses', [])

        if isinstance(current_favorites, dict):
            current_favorites = [current_favorites]

        if to_delete in current_favorites:
            current_favorites.remove(to_delete)
            updated = _patch_user_metadata(g.user_id, token, {'favorite_businesses': current_favorites})
            return jsonify(updated)

        return "Given business not found", 400


class DeleteUserDietaryRestriction(Resource):
    @requires_auth
    def patch(self):
        to_delete = request.json.get('to_delete')

        if not to_delete:
            return "Removed Restriction Required", 400

        token = get_management_api_token()
        current_restrictions = get_user_metadata(g.user_id, token).get('dietary_restrictions', [])

        if to_delete in current_restrictions:
            current_restrictions.remove(to_delete)
            updated = _patch_user_metadata(g.user_id, token, {'dietary_restrictions': current_restrictions})
            return jsonify(updated)

        return "Given restriction not found", 400


def _patch_user_metadata(user_id, token, metadata):
    import http.client
    import json
    import os

    conn = http.client.HTTPSConnection(os.getenv('AUTH0_DOMAIN'))
    payload = json.dumps({"user_metadata": metadata})
    headers = {
        'content-type': "application/json",
        'authorization': f"Bearer {token}"
    }
    conn.request("PATCH", f"/api/v2/users/{user_id}", payload, headers)
    res = conn.getresponse()
    data = res.read()
    return json.loads(data.decode("utf-8"))
