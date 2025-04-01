# app/routes/books.py
from flask import Blueprint, jsonify, request
from app import db
from app.models import Book, Author, Genre
from app.data.books_data import GENRE_DATA, AUTHOR_DATA, BOOKS_DATA

books_bp = Blueprint('books', __name__)

@books_bp.route('', methods=['GET'])
def get_all_books():
    """Get all books with author and genre information"""
    books = Book.query.all()
    return jsonify([book.to_dict() for book in books]), 200

@books_bp.route('/<book_id>', methods=['GET'])
def get_book(book_id):
    """Get a specific book by ID"""
    book = Book.query.filter_by(id=book_id).first()
    
    if not book:
        return jsonify({"message": "Book not found"}), 404
        
    return jsonify(book.to_dict()), 200

@books_bp.route('/seed', methods=['POST'])
def seed_books():
    """Seed the database with books data (admin only in production)"""
    try:
        # Create genres if they don't exist
        genres = {}
        for genre_item in GENRE_DATA:
            genre = Genre.query.filter_by(name=genre_item["name"]).first()
            if not genre:
                genre = Genre(name=genre_item["name"])
                db.session.add(genre)
                db.session.flush()  # To get the ID before commit
            genres[genre.name] = genre
            
        # Create authors if they don't exist
        authors = {}
        for author_item in AUTHOR_DATA:
            author = Author.query.filter_by(name=author_item["name"]).first()
            if not author:
                author = Author(name=author_item["name"])
                db.session.add(author)
                db.session.flush()  # To get the ID before commit
            authors[author.name] = author
            
        # Create books from the imported book data
        for book_data in BOOKS_DATA:
            # Check if the book already exists by title
            existing_book = Book.query.filter_by(title=book_data["title"]).first()
            if not existing_book:
                # Get author and genre
                author = authors.get(book_data["author"])
                genre = genres.get(book_data["genre"])
                
                if not author or not genre:
                    continue
                
                # Create the book
                new_book = Book(
                    title=book_data["title"],
                    year=book_data["year"],
                    image=book_data["image"],
                    pdf=book_data["bookUrl"],
                    price=book_data["price"],
                    author_id=author.id,
                    genre_id=genre.id
                )
                
                db.session.add(new_book)
                
        # Commit all the changes
        db.session.commit()
        
        return jsonify({"message": "Database seeded successfully"}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error seeding database: {str(e)}"}), 500