# scripts/migrate_data.py
"""
This script helps migrate data from the NestJS PostgreSQL database to the Flask database.
Run this script after both databases are set up to transfer all existing data.
"""

import os
import psycopg2
import uuid
from dotenv import load_dotenv
import sys
import json
from datetime import datetime

# Add parent directory to path so we can import app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Load environment variables
load_dotenv()

# Source database (NestJS)
SRC_DB_URI = os.environ.get('SRC_POSTGRES_URI', 'postgresql://postgres:postgres@localhost:5432/qazaq_kitap_nodejs')

# Target database (Flask)
TARGET_DB_URI = os.environ.get('POSTGRES_URI', 'postgresql://postgres:postgres@localhost:5432/qazaq_kitap')

def migrate_data():
    """Migrate data from source to target database"""
    try:
        # Connect to source database
        src_conn = psycopg2.connect(SRC_DB_URI)
        src_cursor = src_conn.cursor()
        
        # Connect to target database
        target_conn = psycopg2.connect(TARGET_DB_URI)
        target_cursor = target_conn.cursor()
        
        print("Connected to databases successfully")
        
        # Migrate authors
        print("\nMigrating authors...")
        src_cursor.execute("SELECT id, name, created_at, updated_at FROM authors")
        authors = src_cursor.fetchall()
        
        for author in authors:
            author_id, name, created_at, updated_at = author
            # Check if author already exists
            target_cursor.execute("SELECT id FROM authors WHERE name = %s", (name,))
            existing_author = target_cursor.fetchone()
            
            if not existing_author:
                target_cursor.execute(
                    "INSERT INTO authors (id, name, created_at, updated_at) VALUES (%s, %s, %s, %s)",
                    (author_id, name, created_at, updated_at)
                )
                print(f"Added author: {name}")
            else:
                print(f"Author already exists: {name}")
        
        # Migrate genres
        print("\nMigrating genres...")
        src_cursor.execute("SELECT id, name, created_at, updated_at FROM genres")
        genres = src_cursor.fetchall()
        
        for genre in genres:
            genre_id, name, created_at, updated_at = genre
            # Check if genre already exists
            target_cursor.execute("SELECT id FROM genres WHERE name = %s", (name,))
            existing_genre = target_cursor.fetchone()
            
            if not existing_genre:
                target_cursor.execute(
                    "INSERT INTO genres (id, name, created_at, updated_at) VALUES (%s, %s, %s, %s)",
                    (genre_id, name, created_at, updated_at)
                )
                print(f"Added genre: {name}")
            else:
                print(f"Genre already exists: {name}")
        
        # Migrate users
        print("\nMigrating users...")
        src_cursor.execute("SELECT id, email, username, password, created_at, updated_at FROM users")
        users = src_cursor.fetchall()
        
        for user in users:
            user_id, email, username, password, created_at, updated_at = user
            # Check if user already exists
            target_cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
            existing_user = target_cursor.fetchone()
            
            if not existing_user:
                target_cursor.execute(
                    "INSERT INTO users (id, email, username, password, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s)",
                    (user_id, email, username, password, created_at, updated_at)
                )
                print(f"Added user: {username}")
            else:
                print(f"User already exists: {username}")
        
        # Migrate books
        print("\nMigrating books...")
        src_cursor.execute("""
            SELECT b.id, b.title, b.year, b.image, b.pdf, b.price, b.author_id, b.genre_id, b.user_id, b.created_at, b.updated_at 
            FROM books b
        """)
        books = src_cursor.fetchall()
        
        for book in books:
            book_id, title, year, image, pdf, price, author_id, genre_id, user_id, created_at, updated_at = book
            # Check if book already exists
            target_cursor.execute("SELECT id FROM books WHERE title = %s", (title,))
            existing_book = target_cursor.fetchone()
            
            if not existing_book:
                target_cursor.execute(
                    "INSERT INTO books (id, title, year, image, pdf, price, author_id, genre_id, user_id, created_at, updated_at) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
                    (book_id, title, year, image, pdf, price, author_id, genre_id, user_id, created_at, updated_at)
                )
                print(f"Added book: {title}")
            else:
                print(f"Book already exists: {title}")
        
        # Migrate favorites
        print("\nMigrating favorites...")
        src_cursor.execute("SELECT id, user_id, book_id, created_at, updated_at FROM favorites")
        favorites = src_cursor.fetchall()
        
        for favorite in favorites:
            fav_id, user_id, book_id, created_at, updated_at = favorite
            # Check if favorite already exists
            target_cursor.execute("SELECT id FROM favorites WHERE user_id = %s AND book_id = %s", (user_id, book_id))
            existing_favorite = target_cursor.fetchone()
            
            if not existing_favorite:
                target_cursor.execute(
                    "INSERT INTO favorites (id, user_id, book_id, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)",
                    (fav_id, user_id, book_id, created_at, updated_at)
                )
                print(f"Added favorite: {book_id} for user {user_id}")
            else:
                print(f"Favorite already exists: {book_id} for user {user_id}")
        
        # Migrate cart items
        print("\nMigrating cart items...")
        src_cursor.execute("SELECT id, user_id, book_id, created_at, updated_at FROM cart")
        cart_items = src_cursor.fetchall()
        
        for cart_item in cart_items:
            cart_id, user_id, book_id, created_at, updated_at = cart_item
            # Check if cart item already exists
            target_cursor.execute("SELECT id FROM cart WHERE user_id = %s AND book_id = %s", (user_id, book_id))
            existing_cart_item = target_cursor.fetchone()
            
            if not existing_cart_item:
                target_cursor.execute(
                    "INSERT INTO cart (id, user_id, book_id, created_at, updated_at) VALUES (%s, %s, %s, %s, %s)",
                    (cart_id, user_id, book_id, created_at, updated_at)
                )
                print(f"Added cart item: {book_id} for user {user_id}")
            else:
                print(f"Cart item already exists: {book_id} for user {user_id}")
        
        # Commit all changes
        target_conn.commit()
        print("\nData migration completed successfully!")
        
    except Exception as e:
        print(f"Error during migration: {str(e)}")
        if 'target_conn' in locals():
            target_conn.rollback()
    finally:
        # Close connections
        if 'src_cursor' in locals():
            src_cursor.close()
        if 'src_conn' in locals():
            src_conn.close()
        if 'target_cursor' in locals():
            target_cursor.close()
        if 'target_conn' in locals():
            target_conn.close()
        print("Database connections closed")

if __name__ == "__main__":
    print("Starting data migration...")
    migrate_data()