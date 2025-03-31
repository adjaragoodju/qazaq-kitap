# app/routes/favorites.py
from flask import Blueprint, jsonify, request, session
from flask_login import login_required, current_user
from app import db
from app.models import Favorite, Book

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('', methods=['POST'])
@login_required
def add_favorite():
    """Add a book to user's favorites"""
    data = request.get_json()
    
    if not data:
        return jsonify({"message": "No input data provided"}), 400
    
    book_id = data.get('bookId')
    
    if not book_id:
        return jsonify({"message": "Book ID is required"}), 400
    
    # Check if the book exists
    book = Book.query.filter_by(id=book_id).first()
    if not book:
        return jsonify({"message": "Book not found"}), 404
    
    # Check if the book is already in favorites
    existing_favorite = Favorite.query.filter_by(
        user_id=current_user.id,
        book_id=book_id
    ).first()
    
    if existing_favorite:
        return jsonify({"message": "Book is already in favorites"}), 409
    
    # Add book to favorites
    new_favorite = Favorite(
        user_id=current_user.id,
        book_id=book_id
    )
    
    try:
        db.session.add(new_favorite)
        db.session.commit()
        return jsonify(new_favorite.to_dict()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error adding to favorites: {str(e)}"}), 500


@favorites_bp.route('/<favorite_id>', methods=['DELETE'])
@login_required
def remove_favorite(favorite_id):
    """Remove a book from user's favorites"""
    favorite = Favorite.query.filter_by(
        id=favorite_id,
        user_id=current_user.id
    ).first()
    
    if not favorite:
        return jsonify({"message": "Favorite not found"}), 404
    
    try:
        db.session.delete(favorite)
        db.session.commit()
        return jsonify({"message": "Favorite removed successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error removing favorite: {str(e)}"}), 500