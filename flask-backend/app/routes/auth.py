# app/routes/auth.py
from flask import Blueprint, request, jsonify, session
from flask_login import login_user, logout_user, current_user, login_required
from app import db
from app.models import User
import uuid

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data:
        return jsonify({"message": "No input data provided"}), 400
    
    email = data.get('email')
    username = data.get('username')
    password = data.get('password')
    
    # Validate input
    if not email or not username or not password:
        return jsonify({"message": "All fields are required"}), 400
    
    if len(password) < 8:
        return jsonify({"message": "Password must be at least 8 characters long"}), 400
    
    # Check if email already exists
    if User.query.filter_by(email=email).first():
        return jsonify({"message": "This email is already taken"}), 409
    
    # Check if username already exists
    if User.query.filter_by(username=username).first():
        return jsonify({"message": "This username is already taken"}), 409
    
    # Create new user
    new_user = User(email=email, username=username, password=password)
    
    try:
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({
            "message": "User registered successfully",
            "user": {
                "username": new_user.username,
                "email": new_user.email
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error occurred: {str(e)}"}), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data:
        return jsonify({"message": "No input data provided"}), 400
    
    login_id = data.get('login')
    password = data.get('password')
    
    # Validate input
    if not login_id or not password:
        return jsonify({"message": "Login and password are required"}), 400
    
    # Find user by email or username
    user = User.query.filter((User.email == login_id) | (User.username == login_id)).first()
    
    if not user:
        return jsonify({"message": "User not found"}), 404
    
    # Check password
    if not user.check_password(password):
        return jsonify({"message": "Password is incorrect"}), 401
    
    # Login user and create session
    login_user(user)
    session.permanent = True
    session['userId'] = str(user.id)
    session['createdAt'] = user.created_at.isoformat()
    
    # Generate a session ID
    session_id = str(uuid.uuid4())
    
    return jsonify({
        "message": "Login successful",
        "rest": {
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "createdAt": user.created_at.isoformat(),
            "updatedAt": user.updated_at.isoformat()
        },
        "sessionId": session_id
    }), 200


@auth_bp.route('/logout', methods=['POST'])
def logout():
    logout_user()
    
    # Clear session
    for key in list(session.keys()):
        session.pop(key, None)
        
    return jsonify({"message": "Logout successful"}), 200


@auth_bp.route('/me', methods=['GET'])
@login_required
def get_me():
    # Get current user data
    user_data = current_user.to_dict(with_relations=True)
    
    return jsonify({
        "message": "User profile fetched successfully",
        "user": user_data
    }), 200