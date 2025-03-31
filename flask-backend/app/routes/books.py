# app/routes/books.py
from flask import Blueprint, jsonify, request
from app.models import Book, Author, Genre
from app import db

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
        genre_data = [
            {"name": "Тарихи"},
            {"name": "Поэзия"},
            {"name": "Роман"},
            {"name": "Повесть"},
            {"name": "Философия"},
            {"name": "Тарихи роман"},
            {"name": "Автобиографиялық шығарма"},
            {"name": "Тарихи повесть"},
            {"name": "Биографиялық роман"}
        ]
        
        genres = {}
        for genre_item in genre_data:
            genre = Genre.query.filter_by(name=genre_item["name"]).first()
            if not genre:
                genre = Genre(name=genre_item["name"])
                db.session.add(genre)
                db.session.flush()  # To get the ID before commit
            genres[genre.name] = genre
            
        # Create authors if they don't exist
        author_data = [
            {"name": "Ілияс Жансүгіров"},
            {"name": "Абай Құнанбайұлы"},
            {"name": "Мұхтар Әуезов"},
            {"name": "Міржақып Дулатов"},
            {"name": "Бердібек Соқпақбаев"},
            {"name": "Ілияс Есенберлин"},
            {"name": "Әзілхан Нұршайықов"},
            {"name": "Әбдіжәміл Нұрпейісов"},
            {"name": "Бауыржан Момышұлы"},
            {"name": "Мұхтар Мағауин"},
            {"name": "Сәуірбек Бақбергенов"}
        ]
        
        authors = {}
        for author_item in author_data:
            author = Author.query.filter_by(name=author_item["name"]).first()
            if not author:
                author = Author(name=author_item["name"])
                db.session.add(author)
                db.session.flush()  # To get the ID before commit
            authors[author.name] = author
            
        # Create books from the JSON array
        books_data = [
            {
                "title": "Құлагер: поэмалар",
                "author": "Ілияс Жансүгіров",
                "year": 1994,
                "genre": "Поэзия",
                "image": "kulager.jpg",
                "bookUrl": "kulager.pdf",
                "price": 1234
            },
            {
                "title": "Абайдың қара сөздері",
                "author": "Абай Құнанбайұлы",
                "year": 1855,
                "genre": "Философия",
                "image": "abaikara.jpeg",
                "bookUrl": "abaikara.pdf",
                "price": 1234
            },
            {
                "title": "Қараш - Қараш оқиғасы",
                "author": "Мұхтар Әуезов",
                "year": 1927,
                "genre": "Повесть",
                "image": "karash.jpeg",
                "bookUrl": "karash.pdf",
                "price": 1234
            },
            {
                "title": "Оян, қазақ!",
                "author": "Міржақып Дулатов",
                "year": 1909,
                "genre": "Поэзия",
                "image": "oyankaz.jpg",
                "bookUrl": "oyankaz.pdf",
                "price": 1234
            },
            {
                "title": "Менің атым Қожа",
                "author": "Бердібек Соқпақбаев",
                "year": 1957,
                "genre": "Повесть",
                "image": "kozha.jpg",
                "bookUrl": "kozha.pdf",
                "price": 1234
            },
            {
                "title": "Көшпенділер",
                "author": "Ілияс Есенберлин",
                "year": 1971,
                "genre": "Тарихи роман",
                "image": "koshpendiler.jpg",
                "bookUrl": "koshpendiler.pdf",
                "price": 1234
            },
            {
                "title": "Махаббат, қызық мол жылдар",
                "author": "Әзілхан Нұршайықов",
                "year": 1970,
                "genre": "Роман",
                "image": "mahabbat.jpg",
                "bookUrl": "mahabbat.pdf",
                "price": 1234
            },
            {
                "title": "Қан мен тер",
                "author": "Әбдіжәміл Нұрпейісов",
                "year": 1970,
                "genre": "Роман",
                "image": "qanmenter.jpg",
                "bookUrl": "qanmenter.pdf",
                "price": 1234
            },
            {
                "title": "Ұшқан ұя",
                "author": "Бауыржан Момышұлы",
                "year": 1975,
                "genre": "Автобиографиялық шығарма",
                "image": "ushkanuya.jpg",
                "bookUrl": "ushkanuya.pdf",
                "price": 1234
            },
            {
                "title": "Қилы заман",
                "author": "Мұхтар Әуезов",
                "year": 1928,
                "genre": "Тарихи повесть",
                "image": "qilyzaman.jpg",
                "bookUrl": "qilyzaman.pdf",
                "price": 1234
            },
            {
                "title": "Шоқан асулары",
                "author": "Сәуірбек Бақбергенов",
                "year": 1983,
                "genre": "Биографиялық роман",
                "image": "shokan.png",
                "bookUrl": "shokan.pdf",
                "price": 1234
            },
            {
                "title": "Аласапыран",  
                "author": "Мұхтар Мағауин",
                "year": 1980,
                "genre": "Тарихи роман",
                "image": "alasapyran.jpg",
                "bookUrl": "alasapyran.pdf",
                "price": 1234
            }
        ]
        
        for book_data in books_data:
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