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
    app.config['SESSION_REDIS'] = redis.from_url(redis_uri)
    
    sess.init_app(app)
    
    # Configure static folder for uploads
    os.makedirs(os.path.join(app.root_path, 'static', 'uploads'), exist_ok=True)
    
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
        
    return app