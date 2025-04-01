# app/models/__init__.py
"""
Database models for the application.
This file imports all models and avoids circular imports.
"""
# Import all models
from app.models.user import User
from app.models.author import Author
from app.models.genre import Genre
from app.models.book import Book
from app.models.favorite import Favorite
from app.models.cart import Cart

# All models are now available through this module
__all__ = ['User', 'Author', 'Genre', 'Book', 'Favorite', 'Cart']