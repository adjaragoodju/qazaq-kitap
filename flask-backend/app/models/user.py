# app/models/user.py
import uuid
from datetime import datetime
from flask_login import UserMixin
from app import db, bcrypt
from sqlalchemy.dialects.postgresql import UUID

class User(db.Model, UserMixin):
    __tablename__ = 'users'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = db.Column(db.String(255), unique=True, nullable=False)
    username = db.Column(db.String(255), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    favorites = db.relationship('Favorite', back_populates='user', lazy='dynamic', cascade='all, delete-orphan')
    cart_items = db.relationship('Cart', back_populates='user', lazy='dynamic', cascade='all, delete-orphan')
    books = db.relationship('Book', back_populates='user', lazy='dynamic')
    
    def __init__(self, email, username, password):
        self.email = email
        self.username = username
        self.set_password(password)
    
    def set_password(self, password):
        self.password = bcrypt.generate_password_hash(password).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.check_password_hash(self.password, password)
    
    def to_dict(self, with_relations=False):
        data = {
            'id': str(self.id),
            'email': self.email,
            'username': self.username,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if with_relations:
            data['Favorite'] = [favorite.to_dict(with_book=True) for favorite in self.favorites]
            data['Cart'] = [cart_item.to_dict(with_book=True) for cart_item in self.cart_items]
        
        return data


# app/models/author.py
import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID

class Author(db.Model):
    __tablename__ = 'authors'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    books = db.relationship('Book', back_populates='author', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


# app/models/genre.py
import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID

class Genre(db.Model):
    __tablename__ = 'genres'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    books = db.relationship('Book', back_populates='genre', lazy='dynamic')
    
    def to_dict(self):
        return {
            'id': str(self.id),
            'name': self.name,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }


# app/models/book.py
import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID

class Book(db.Model):
    __tablename__ = 'books'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(255), nullable=False)
    pdf = db.Column(db.String(255), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Foreign keys
    author_id = db.Column(UUID(as_uuid=True), db.ForeignKey('authors.id'), nullable=False)
    genre_id = db.Column(UUID(as_uuid=True), db.ForeignKey('genres.id'), nullable=False)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=True)
    
    # Relationships
    author = db.relationship('Author', back_populates='books')
    genre = db.relationship('Genre', back_populates='books')
    user = db.relationship('User', back_populates='books')
    favorites = db.relationship('Favorite', back_populates='book', lazy='dynamic', cascade='all, delete-orphan')
    cart_items = db.relationship('Cart', back_populates='book', lazy='dynamic', cascade='all, delete-orphan')
    
    def to_dict(self, with_relations=True):
        data = {
            'id': str(self.id),
            'title': self.title,
            'year': self.year,
            'image': self.image,
            'pdf': self.pdf,
            'price': self.price,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if with_relations:
            data['author'] = self.author.to_dict() if self.author else None
            data['genre'] = {'name': self.genre.name} if self.genre else None
            
        return data


# app/models/favorite.py
import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID

class Favorite(db.Model):
    __tablename__ = 'favorites'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(UUID(as_uuid=True), db.ForeignKey('books.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='favorites')
    book = db.relationship('Book', back_populates='favorites')
    
    def to_dict(self, with_book=False):
        data = {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'book_id': str(self.book_id),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if with_book:
            data['Book'] = self.book.to_dict()
            
        return data


# app/models/cart.py
import uuid
from datetime import datetime
from app import db
from sqlalchemy.dialects.postgresql import UUID

class Cart(db.Model):
    __tablename__ = 'cart'
    
    id = db.Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = db.Column(UUID(as_uuid=True), db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(UUID(as_uuid=True), db.ForeignKey('books.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    user = db.relationship('User', back_populates='cart_items')
    book = db.relationship('Book', back_populates='cart_items')
    
    def to_dict(self, with_book=False):
        data = {
            'id': str(self.id),
            'user_id': str(self.user_id),
            'book_id': str(self.book_id),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        if with_book:
            data['Book'] = self.book.to_dict()
            
        return data


# app/models/__init__.py
from app.models.user import User
from app.models.book import Book
from app.models.author import Author
from app.models.genre import Genre
from app.models.favorite import Favorite
from app.models.cart import Cart