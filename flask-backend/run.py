# run.py
import os
from dotenv import load_dotenv
from app import create_app, db

# Load environment variables from .env file
load_dotenv()

# Create and configure the app
app = create_app(os.getenv('FLASK_CONFIG', 'development'))

@app.cli.command("seed-db")
def seed_database():
    """Seed the database with initial data"""
    with app.app_context():
        from app.routes.books import seed_books
        result = seed_books()
        print("Database seeded successfully!")

if __name__ == '__main__':
    # Run the app
    port = int(os.getenv('PORT', 3000))
    debug = os.getenv('FLASK_DEBUG', 'True').lower() in ('true', '1', 't')
    app.run(host='0.0.0.0', port=port, debug=debug)