# tests/test_app.py
"""
Basic tests for the Flask application
"""
import os
import sys
import json
import unittest
from flask import session
import uuid

# Add parent directory to path to import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models import User, Book, Author, Genre, Favorite, Cart

class FlaskAppTestCase(unittest.TestCase):
    """Basic test case for the Flask application"""
    
    def setUp(self):
        """Set up test environment"""
        self.app = create_app('testing')
        self.app.config['TESTING'] = True
        self.app.config['WTF_CSRF_ENABLED'] = False
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        self.app_context = self.app.app_context()
        self.app_context.push()
        db.create_all()
        self.client = self.app.test_client()
        self.client.testing = True
    
    def tearDown(self):
        """Clean up test environment"""
        db.session.remove()
        db.drop_all()
        self.app_context.pop()
    
    def test_app_exists(self):
        """Test that the app exists"""
        self.assertIsNotNone(self.app)
    
    def test_app_is_testing(self):
        """Test that the app is in testing mode"""
        self.assertTrue(self.app.config['TESTING'])
    
    def test_database_structure(self):
        """Test database structure and relationships"""
        # Create a test user
        user = User(
            username='testuser',
            email='test@example.com',
            password='password123'
        )
        db.session.add(user)
        
        # Create test genre and author
        genre = Genre(name='Test Genre')
        author = Author(name='Test Author')
        db.session.add_all([genre, author])
        db.session.commit()
        
        # Create a test book
        book = Book(
            title='Test Book',
            year=2023,
            image='test.jpg',
            pdf='test.pdf',
            price=1000,
            author_id=author.id,
            genre_id=genre.id
        )
        db.session.add(book)
        db.session.commit()
        
        # Test relationships
        self.assertEqual(book.author.name, 'Test Author')
        self.assertEqual(book.genre.name, 'Test Genre')
        
        # Add to favorites
        favorite = Favorite(
            user_id=user.id,
            book_id=book.id
        )
        db.session.add(favorite)
        
        # Add to cart
        cart_item = Cart(
            user_id=user.id,
            book_id=book.id
        )
        db.session.add(cart_item)
        db.session.commit()
        
        # Test user relationships
        self.assertEqual(user.favorites.count(), 1)
        self.assertEqual(user.cart_items.count(), 1)
        self.assertEqual(user.favorites.first().book.title, 'Test Book')
    
    def test_user_registration(self):
        """Test user registration endpoint"""
        # Register a new user
        response = self.client.post(
            '/api/auth/register',
            data=json.dumps({
                'username': 'newuser',
                'email': 'newuser@example.com',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        # Check response
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'User registered successfully')
        self.assertEqual(data['user']['username'], 'newuser')
        
        # Verify user was created in database
        user = User.query.filter_by(username='newuser').first()
        self.assertIsNotNone(user)
        self.assertEqual(user.email, 'newuser@example.com')
    
    def test_login_logout(self):
        """Test login and logout endpoints"""
        # Create a test user
        user = User(
            username='logintest',
            email='login@example.com',
            password='password123'
        )
        db.session.add(user)
        db.session.commit()
        
        # Test login
        response = self.client.post(
            '/api/auth/login',
            data=json.dumps({
                'login': 'logintest',
                'password': 'password123'
            }),
            content_type='application/json'
        )
        
        # Check login response
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Login successful')
        
        # Test logout
        response = self.client.post('/api/auth/logout')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Logout successful')
    
    def test_get_books(self):
        """Test getting all books endpoint"""
        # Create test data
        genre = Genre(name='Fiction')
        author = Author(name='Author Name')
        db.session.add_all([genre, author])
        db.session.commit()
        
        # Create test books
        book1 = Book(
            title='Book One',
            year=2022,
            image='book1.jpg',
            pdf='book1.pdf',
            price=1000,
            author_id=author.id,
            genre_id=genre.id
        )
        
        book2 = Book(
            title='Book Two',
            year=2023,
            image='book2.jpg',
            pdf='book2.pdf',
            price=1200,
            author_id=author.id,
            genre_id=genre.id
        )
        
        db.session.add_all([book1, book2])
        db.session.commit()
        
        # Test getting all books
        response = self.client.get('/api/books')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]['title'], 'Book One')
        self.assertEqual(data[1]['title'], 'Book Two')

if __name__ == '__main__':
    unittest.main()