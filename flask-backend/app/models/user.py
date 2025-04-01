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
    
    # Relationships - defined here but will be fully configured after all models are imported
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