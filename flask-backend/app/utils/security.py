# app/utils/security.py
from functools import wraps
from flask import jsonify, request, session
from flask_login import current_user

def auth_required(f):
    """Custom decorator to check if user is authenticated via session."""
    @wraps(f)
    def decorated(*args, **kwargs):
        if 'userId' not in session:
            return jsonify({"message": "Please login to access this resource"}), 401
        return f(*args, **kwargs)
    return decorated