# app/routes/cart.py
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app import db
from app.models import Cart, Book

cart_bp = Blueprint('cart', __name__)

@cart_bp.route('', methods=['POST'])
@login_required
def add_to_cart():
    """Add a book to user's cart"""
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
    
    # Check if the book is already in cart
    existing_cart_item = Cart.query.filter_by(
        user_id=current_user.id,
        book_id=book_id
    ).first()
    
    if existing_cart_item:
        return jsonify({"message": "Book is already in cart"}), 409
    
    # Add book to cart
    new_cart_item = Cart(
        user_id=current_user.id,
        book_id=book_id
    )
    
    try:
        db.session.add(new_cart_item)
        db.session.commit()
        return jsonify(new_cart_item.to_dict(with_book=True)), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error adding to cart: {str(e)}"}), 500


@cart_bp.route('/<cart_id>', methods=['DELETE'])
@login_required
def remove_from_cart(cart_id):
    """Remove a book from user's cart"""
    cart_item = Cart.query.filter_by(
        id=cart_id,
        user_id=current_user.id
    ).first()
    
    if not cart_item:
        return jsonify({"message": "Cart item not found"}), 404
    
    try:
        db.session.delete(cart_item)
        db.session.commit()
        return jsonify({"message": "Item removed from cart successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error removing item from cart: {str(e)}"}), 500