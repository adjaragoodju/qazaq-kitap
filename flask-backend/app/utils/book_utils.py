# app/utils/book_utils.py
import os
import shutil
from flask import current_app
import uuid

def ensure_upload_directories():
    """Ensure all necessary upload directories exist"""
    app_root = current_app.root_path
    uploads_path = os.path.join(app_root, 'static', 'uploads')
    
    # Make sure the main uploads directory exists
    os.makedirs(uploads_path, exist_ok=True)
    
    # Create placeholder image if it doesn't exist
    placeholder_path = os.path.join(uploads_path, 'placeholder.png')
    if not os.path.exists(placeholder_path):
        # You might want to copy a default image here, or create one programmatically
        # For now, we'll just create an empty file as a placeholder
        with open(placeholder_path, 'w') as f:
            f.write('')
    
    return uploads_path

def get_book_image_path(image_filename):
    """Get the full path to a book image"""
    uploads_path = ensure_upload_directories()
    return os.path.join(uploads_path, image_filename)

def get_book_pdf_path(pdf_filename):
    """Get the full path to a book PDF"""
    uploads_path = ensure_upload_directories()
    return os.path.join(uploads_path, pdf_filename)

def save_uploaded_file(uploaded_file, filename=None):
    """Save an uploaded file to the uploads directory"""
    if not filename:
        # Generate a unique filename if none provided
        ext = os.path.splitext(uploaded_file.filename)[1]
        filename = f"{uuid.uuid4()}{ext}"
    
    uploads_path = ensure_upload_directories()
    file_path = os.path.join(uploads_path, filename)
    
    # Save the file
    uploaded_file.save(file_path)
    
    return filename