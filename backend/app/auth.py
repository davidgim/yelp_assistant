import os
from functools import wraps

import jwt
from jwt import PyJWKClient
from flask import request, g

AUTH0_DOMAIN = os.environ.get('AUTH0_DOMAIN')
AUTH0_AUDIENCE = os.environ.get('AUTH0_AUDIENCE')

_jwks_client = None


class AuthError(Exception):
    def __init__(self, message, status_code):
        self.message = message
        self.status_code = status_code


def _get_jwks_client():
    global _jwks_client
    if _jwks_client is None:
        _jwks_client = PyJWKClient(f"https://{AUTH0_DOMAIN}/.well-known/jwks.json")
    return _jwks_client


def _get_bearer_token():
    auth_header = request.headers.get('Authorization', None)
    if not auth_header:
        return None
    parts = auth_header.split()
    if len(parts) != 2 or parts[0].lower() != 'bearer':
        raise AuthError('Authorization header must be in the form "Bearer <token>"', 401)
    return parts[1]


def _decode_token(token):
    try:
        signing_key = _get_jwks_client().get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=['RS256'],
            audience=AUTH0_AUDIENCE,
            issuer=f"https://{AUTH0_DOMAIN}/",
        )
    except jwt.PyJWTError as e:
        raise AuthError(f'Invalid or expired token: {str(e)}', 401)
    return payload


def requires_auth(f):
    """Rejects the request unless it carries a valid Auth0 access token.
    Sets g.user_id to the token's verified subject (Auth0 user id)."""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = _get_bearer_token()
        if not token:
            raise AuthError('Authorization header is required', 401)
        payload = _decode_token(token)
        g.user_id = payload['sub']
        return f(*args, **kwargs)
    return decorated


def optional_auth(f):
    """Verifies the token if one is present; otherwise proceeds anonymously.
    Never trusts a client-supplied user id, only a verified token's subject."""
    @wraps(f)
    def decorated(*args, **kwargs):
        g.user_id = None
        token = _get_bearer_token()
        if token:
            payload = _decode_token(token)
            g.user_id = payload['sub']
        return f(*args, **kwargs)
    return decorated
