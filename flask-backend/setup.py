#!/usr/bin/env python
"""
Simple setup script to initialize the Flask application
"""
import os
import sys
from dotenv import load_dotenv

def setup_app():
    """Setup the Flask application"""
    print("Setting up the Flask application...")
    
    # Load environment variables
    load_dotenv()
    
    # Import the Flask app and database
    from app import create_app, db
    import app.models
    
    # Create a Flask application instance
    app = create_app(os.getenv('FLASK_CONFIG', 'development'))
    
    # Create database tables
    with app.app_context():
        db.create_all()
        print("Database tables created successfully!")
        
        # Ask if user wants to seed the database
        seed = input("Do you want to seed the database with sample data? (y/n): ")
        if seed.lower() == 'y':
            from app.routes.books import seed_books
            with app.test_request_context():
                result = seed_books()
                print("Database seeded successfully!")
    
    print("\nSetup completed successfully!")
    print("\nTo run the application, use:")
    print("  flask run -p 3000")
    print("\nTo create an admin user, use:")
    print("  python manage.py create_admin")
    print("\nTo run database migrations, use:")
    print("  python manage.py db init     # Only needed on first run")
    print("  python manage.py db migrate  # Create migration")
    print("  python manage.py db upgrade  # Apply migration")

if __name__ == '__main__':
    setup_app()