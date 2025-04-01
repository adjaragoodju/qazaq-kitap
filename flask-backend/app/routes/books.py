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
# Modified version of the seeding function for app/routes/books.py

@books_bp.route('/seed', methods=['POST'])
def seed_books():
    """Seed the database with books data (admin only in production)"""
    try:
        # Import book_utils
        from app.utils.book_utils import ensure_upload_directories
        
        # Ensure uploads directory exists
        uploads_dir = ensure_upload_directories()
        
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
            
        # Create placeholder files if needed
        # Create an empty placeholder image if it doesn't exist
        placeholder_path = os.path.join(uploads_dir, 'placeholder.png')
        if not os.path.exists(placeholder_path):
            with open(placeholder_path, 'wb') as f:
                # Minimal valid PNG file (1x1 transparent pixel)
                png_data = bytes.fromhex(
                    '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4'
                    '8900000006624b474400ff00ff00ffa0bda793000000097048597300000b1300'
                    '000b1301009a9c180000000774494d4507e5010101000082d7fb7c0000001d69'
                    '5448450000000000000000000000000000000000000000000000000171361302'
                    '00000009704859730000000049495420000000ae49444154081563600060000'
                    '0000100011a21569800000000049454e44ae426082'
                )
                f.write(png_data)
            
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
                
                # Check if image file exists, or create placeholder entry
                image_path = os.path.join(uploads_dir, book_data["image"])
                if not os.path.exists(image_path):
                    # If image doesn't exist, create an empty file as a placeholder
                    with open(image_path, 'w') as f:
                        f.write('')
                
                # Check if PDF file exists, or create placeholder entry
                pdf_path = os.path.join(uploads_dir, book_data["bookUrl"])
                if not os.path.exists(pdf_path):
                    # If PDF doesn't exist, create an empty file as a placeholder
                    with open(pdf_path, 'w') as f:
                        f.write('PDF placeholder for: ' + book_data["title"])
                
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