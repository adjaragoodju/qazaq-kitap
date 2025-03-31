# QazaqKitap Flask Backend

This is the Flask backend for the QazaqKitap online book store application.

## Features

- User authentication (register, login, logout)
- Book browsing and filtering
- Book details viewing
- Favorites management
- Shopping cart functionality

## Tech Stack

- Flask 3.0
- SQLAlchemy (ORM)
- PostgreSQL (Database)
- Redis (Session storage)
- Flask-Login (Authentication)
- Flask-CORS (Cross-Origin Resource Sharing)
- Flask-Session (Server-side session)
- Gunicorn (WSGI server)

## Getting Started

### Prerequisites

- Python 3.11+
- PostgreSQL
- Redis

### Installation

1. Clone the repository:

   ```
   git clone https://github.com/yourusername/qazaq-kitap-flask.git
   cd qazaq-kitap-flask
   ```

2. Create a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

4. Copy the environment file and modify as needed:

   ```
   cp .env.example .env
   ```

5. Create the database:

   ```
   # Log into PostgreSQL
   psql -U postgres

   # Create a new database
   CREATE DATABASE qazaq_kitap;

   # Exit PostgreSQL
   \q
   ```

### Running the Application

1. Start the Flask application:

   ```
   flask run -p 3000
   ```

2. Seed the database with initial data:
   ```
   # Open a web browser or use curl/Postman to make a POST request to:
   http://localhost:3000/api/books/seed
   ```

### Using Docker

Alternatively, you can use Docker Compose to run the entire stack:

1. Make sure Docker and Docker Compose are installed
2. Run:
   ```
   docker-compose up -d
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `POST /api/auth/logout` - Log out a user
- `GET /api/auth/me` - Get current user profile

### Books

- `GET /api/books` - Get all books
- `GET /api/books/:id` - Get a specific book
- `POST /api/books/seed` - Seed the database with initial data

### Favorites

- `POST /api/favorites` - Add a book to favorites
- `DELETE /api/favorites/:id` - Remove a book from favorites

### Cart

- `POST /api/cart` - Add a book to cart
- `DELETE /api/cart/:id` - Remove a book from cart

## Frontend Integration

The backend is designed to work with the React frontend. The frontend expects certain API responses and behavior from this backend.

Make sure to configure the CORS settings properly in the `.env` file to allow requests from the frontend domain.
