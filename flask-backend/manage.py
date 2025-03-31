#!/usr/bin/env python
# manage.py
"""
Database migration manager script for the Flask application
"""
import os
from dotenv import load_dotenv
from app import create_app, db
import app.models

# Load environment variables from .env file
load_dotenv()

# Create a Flask application instance
app = create_app(os.getenv('FLASK_CONFIG', 'development'))


@app.cli.command("seed")
def seed():
    """Seed the database with initial data"""
    from app.routes.books import seed_books
    with app.test_request_context():
        result = seed_books()
    print("Database seeded successfully!")


@app.cli.command("create-admin")
def create_admin():
    """Create an admin user"""
    from app.models import User
    
    username = input("Enter admin username: ")
    email = input("Enter admin email: ")
    password = input("Enter admin password: ")
    
    # Check if user already exists
    existing_user = User.query.filter((User.username == username) | (User.email == email)).first()
    if existing_user:
        print(f"User with username '{username}' or email '{email}' already exists.")
        return
    
    # Create admin user
    admin = User(username=username, email=email, password=password)
    
    try:
        db.session.add(admin)
        db.session.commit()
        print(f"Admin user '{username}' created successfully!")
    except Exception as e:
        print(f"Error creating admin user: {str(e)}")


@app.cli.command("recreate-db")
def recreate_db():
    """Recreate the database (drops all tables and recreates them)"""
    if app.config['ENV'] == 'production':
        print("This command cannot be run in production mode!")
        return
    
    confirmation = input("Are you sure you want to recreate the database? This will delete all data! (y/n): ")
    if confirmation.lower() == 'y':
        db.drop_all()
        db.create_all()
        print("Database recreated successfully.")
    else:
        print("Operation cancelled.")


if __name__ == '__main__':
    app.run()