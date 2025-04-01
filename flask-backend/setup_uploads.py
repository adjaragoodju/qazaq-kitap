# setup_uploads.py

import os
import sys
import shutil

def setup_uploads():
    """Setup the uploads directory structure and add initial content"""
    print("Setting up uploads directory...")
    
    # Get the current directory (flask-backend)
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to the app/static/uploads directory
    uploads_dir = os.path.join(base_dir, 'app', 'static', 'uploads')
    
    # Create the uploads directory if it doesn't exist
    os.makedirs(uploads_dir, exist_ok=True)
    print(f"Created directory: {uploads_dir}")
    
    # Create a placeholder image
    placeholder_path = os.path.join(uploads_dir, 'placeholder.png')
    if not os.path.exists(placeholder_path):
        # Create a simple 1x1 pixel transparent PNG as a placeholder
        # In a real app, you'd want to copy a proper placeholder image
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
        print(f"Created placeholder image: {placeholder_path}")

    print("Uploads directory setup complete.")

if __name__ == "__main__":
    setup_uploads()