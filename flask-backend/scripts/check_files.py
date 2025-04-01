#!/usr/bin/env python
# check_files.py - Verify file integrity for QazaqKitap

import os
import sys
import json
from flask import Flask
from app.models import Book
from app import create_app, db

def check_files():
    """
    Check that all book images and PDFs exist and are accessible.
    Create placeholders for any missing files.
    """
    print("Checking file integrity...")
    
    # Create application context
    app = create_app('development')
    with app.app_context():
        # Path to uploads directory
        uploads_dir = os.path.join(app.root_path, 'static', 'uploads')
        os.makedirs(uploads_dir, exist_ok=True)
        
        # Create placeholder image if it doesn't exist
        placeholder_img_path = os.path.join(uploads_dir, 'placeholder.png')
        if not os.path.exists(placeholder_img_path):
            print(f"Creating placeholder image at {placeholder_img_path}")
            # Minimal valid PNG file (1x1 transparent pixel)
            png_data = bytes.fromhex(
                '89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4'
                '8900000006624b474400ff00ff00ffa0bda793000000097048597300000b1300'
                '000b1301009a9c180000000774494d4507e5010101000082d7fb7c0000001d69'
                '5448450000000000000000000000000000000000000000000000000171361302'
                '00000009704859730000000049495420000000ae49444154081563600060000'
                '0000100011a21569800000000049454e44ae426082'
            )
            with open(placeholder_img_path, 'wb') as f:
                f.write(png_data)
        
        # Create empty PDF placeholder
        placeholder_pdf_path = os.path.join(uploads_dir, 'placeholder.pdf')
        if not os.path.exists(placeholder_pdf_path):
            print(f"Creating placeholder PDF at {placeholder_pdf_path}")
            with open(placeholder_pdf_path, 'w') as f:
                f.write('%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF\n')
        
        # Get all books from database
        books = Book.query.all()
        
        missing_files = {"images": [], "pdfs": []}
        fixed_files = {"images": [], "pdfs": []}
        
        print(f"Checking {len(books)} books...")
        
        # Check each book's files
        for book in books:
            # Check image
            image_path = os.path.join(uploads_dir, book.image)
            if not os.path.exists(image_path):
                missing_files["images"].append(book.image)
                
                # Create empty file as placeholder
                with open(image_path, 'wb') as f:
                    with open(placeholder_img_path, 'rb') as src:
                        f.write(src.read())
                
                fixed_files["images"].append(book.image)
                print(f"Created placeholder for missing image: {book.image}")
            
            # Check PDF
            pdf_path = os.path.join(uploads_dir, book.pdf)
            if not os.path.exists(pdf_path):
                missing_files["pdfs"].append(book.pdf)
                
                # Create empty file as placeholder
                with open(pdf_path, 'wb') as f:
                    with open(placeholder_pdf_path, 'rb') as src:
                        f.write(src.read())
                
                fixed_files["pdfs"].append(book.pdf)
                print(f"Created placeholder for missing PDF: {book.pdf}")
        
        # Summary
        print("\nFile check summary:")
        print(f"- Total books in database: {len(books)}")
        print(f"- Missing images found and fixed: {len(fixed_files['images'])}")
        print(f"- Missing PDFs found and fixed: {len(fixed_files['pdfs'])}")
        
        # Check for 'static' directory accessibility via URL
        print("\nVerifying static files accessibility:")
        print("1. Make sure the Flask app is running")
        print("2. Check the API endpoint: http://localhost:3000/api/static/uploads/placeholder.png")
        print("3. If not accessible, ensure your Flask app has a route for serving static files")
        print("   - Add the static file route to app/__init__.py (as in the fix provided)")
        
        # Recommend frontend fixes
        print("\nFrontend components using image paths:")
        print("1. Check Book.jsx, BookDetail.jsx, FavoritesPage.jsx, CartPage.jsx, and ProfilePage.jsx")
        print("2. Make sure all image URLs use: http://localhost:3000/api/static/uploads/{image}")
        print("3. Make sure all PDF URLs use: http://localhost:3000/api/static/uploads/{pdf}")
        
        # Create report file
        report = {
            "total_books": len(books),
            "missing_images": missing_files["images"],
            "missing_pdfs": missing_files["pdfs"],
            "fixed_images": fixed_files["images"],
            "fixed_pdfs": fixed_files["pdfs"]
        }
        
        report_path = os.path.join(app.root_path, 'static', 'file_check_report.json')
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"\nDetailed report saved to: {report_path}")

if __name__ == '__main__':
    check_files()