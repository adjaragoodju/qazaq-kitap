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