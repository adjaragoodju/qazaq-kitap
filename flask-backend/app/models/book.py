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