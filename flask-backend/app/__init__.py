from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from flask_cors import CORS
from flask_session import Session
from flask_bcrypt import Bcrypt
import os
import redis
from datetime import timedelta
from flask import send_from_directory

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()
login_manager = LoginManager()
bcrypt = Bcrypt()
cors = CORS()
sess = Session()

def create_app(config_name=None):
    app = Flask(__name__)
    
    # Load configuration
    if config_name is None:
        config_name = os.environ.get('FLASK_CONFIG', 'development')
    
    app.config.from_object(f'app.config.{config_name.capitalize()}Config')
    
    # Initialize extensions with app
    db.init_app(app)
    migrate.init_app(app, db)
    login_manager.init_app(app)
    bcrypt.init_app(app)
    
    # Configure CORS
    cors.init_app(app, resources={r"/api/*": {"origins": app.config.get('ALLOWED_ORIGINS', '*'), "supports_credentials": True}})
    
    # Configure session with proper Redis connection
    app.config['SESSION_TYPE'] = 'redis'
    app.config['SESSION_PERMANENT'] = True
    app.config['SESSION_PERMANENT_LIFETIME'] = timedelta(days=1)
    
    # Get Redis URI from environment or use default with service name
    redis_uri = os.environ.get('REDIS_URI', 'redis://:pass@redis:6379/0')
    try:
        app.config['SESSION_REDIS'] = redis.from_url(redis_uri)
        # Test the Redis connection
        app.config['SESSION_REDIS'].ping()
        print("Redis connection successful")
    except redis.exceptions.ConnectionError as e:
        print(f"WARNING: Could not connect to Redis: {e}")
        # Fallback to filesystem session if Redis is not available
        app.config['SESSION_TYPE'] = 'filesystem'
        print("Using filesystem sessions instead")
    
    sess.init_app(app)
    
    # Configure static folders for uploads
    uploads_path = os.path.join(app.root_path, 'static', 'uploads')
    books_path = os.path.join(uploads_path, 'books')
    os.makedirs(uploads_path, exist_ok=True)
    os.makedirs(books_path, exist_ok=True)
    
    # Create placeholder image if it doesn't exist
    placeholder_path = os.path.join(uploads_path, 'placeholder.png')
    if not os.path.exists(placeholder_path):
        print(f"Creating placeholder image at {placeholder_path}")
        # Create a minimal valid PNG file as placeholder
        with open(placeholder_path, 'wb') as f:
            # Minimal valid PNG file (1x1 transparent pixel)
            png_data = bytes.fromhex(
                '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4'
                '8900000006624b474400ff00ff00ffa0bda793000000097048597300000b1300'
                '000b1301009a9c180000000774494d4507e5010101000082d7fb7c0000001d69'
                '5448450000000000000000000000000000000000000000000000000171361302'
                '00000009704859730000000049495420000000ae49444154081563600060000'
                '0000100011a21569800000000049454e44ae426082'
            )
            f.write(png_data)
    
    # Register blueprints
    with app.app_context():
        from app.routes.auth import auth_bp
        from app.routes.books import books_bp
        from app.routes.favorites import favorites_bp
        from app.routes.cart import cart_bp
        
        app.register_blueprint(auth_bp, url_prefix='/api/auth')
        app.register_blueprint(books_bp, url_prefix='/api/books')
        app.register_blueprint(favorites_bp, url_prefix='/api/favorites')
        app.register_blueprint(cart_bp, url_prefix='/api/cart')
        
        # Setup login manager
        login_manager.login_view = 'auth.login'
        
        @login_manager.user_loader
        def load_user(user_id):
            from app.models import User
            return User.query.get(user_id)
        
        # Create database tables
        db.create_all()

        # Add route to serve static files
        @app.route('/api/static/<path:filename>')
        def serve_static(filename):
            return send_from_directory(app.static_folder, filename)
        
        # Add specific route for book PDFs to simplify frontend access
        @app.route('/api/books/pdf/<path:filename>')
        def serve_book_pdf(filename):
            books_dir = os.path.join(app.static_folder, 'uploads', 'books')
            return send_from_directory(books_dir, filename)
        
    return app