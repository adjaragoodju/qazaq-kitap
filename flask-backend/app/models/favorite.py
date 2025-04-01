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