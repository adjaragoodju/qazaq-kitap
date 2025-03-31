import os
from datetime import timedelta

class Config:
    """Base configuration."""
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev-key-please-change')
    SESSION_COOKIE_NAME = os.environ.get('SESSION_NAME', 'qazaq_kitap_session')
    SESSION_PERMANENT = True
    SESSION_USE_SIGNER = True
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
    
    # Database
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Redis settings
    REDIS_URI = os.environ.get('REDIS_URI', 'redis://:password@localhost:6379/0')
    
    # CORS settings
    ALLOWED_ORIGINS = os.environ.get('ALLOWED_ORIGIN', 'http://localhost:5173').split(',')
    
    # Upload settings
    UPLOAD_FOLDER = os.path.join('app', 'static', 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB max upload size


class DevelopmentConfig(Config):
    """Development configuration."""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('POSTGRES_URI', 'postgresql://postgres:postgres@localhost:5432/qazaq_kitap')
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_FOLDER = 'qazaq_kitap_dev:'


class TestingConfig(Config):
    """Testing configuration."""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('TEST_DATABASE_URI', 'postgresql://postgres:postgres@localhost:5432/qazaq_kitap_test')
    SESSION_FOLDER = 'qazaq_kitap_test:'


class ProductionConfig(Config):
    """Production configuration."""
    SQLALCHEMY_DATABASE_URI = os.environ.get('POSTGRES_URI', 'postgresql://postgres:postgres@localhost:5432/qazaq_kitap')
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_FOLDER = 'qazaq_kitap:'