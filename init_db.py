"""Script to initialize database with sample books"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from main import Base, Book
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost/bookstore")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# Sample books data
sample_books = [
    {
        "title": "The Great Gatsby",
        "author": "F. Scott Fitzgerald",
        "description": "A classic American novel set in the Jazz Age, following the mysterious millionaire Jay Gatsby and his obsession with Daisy Buchanan.",
        "price": 12.99,
        "image_url": "https://via.placeholder.com/300x400?text=The+Great+Gatsby"
    },
    {
        "title": "To Kill a Mockingbird",
        "author": "Harper Lee",
        "description": "A gripping tale of racial injustice and childhood innocence in the American South, told through the eyes of Scout Finch.",
        "price": 11.99,
        "image_url": "https://via.placeholder.com/300x400?text=To+Kill+a+Mockingbird"
    },
    {
        "title": "1984",
        "author": "George Orwell",
        "description": "A dystopian novel about a totalitarian society where Big Brother watches everyone and independent thought is forbidden.",
        "price": 13.99,
        "image_url": "https://via.placeholder.com/300x400?text=1984"
    },
    {
        "title": "Pride and Prejudice",
        "author": "Jane Austen",
        "description": "A romantic novel following Elizabeth Bennet as she navigates social expectations and finds love with Mr. Darcy.",
        "price": 10.99,
        "image_url": "https://via.placeholder.com/300x400?text=Pride+and+Prejudice"
    },
    {
        "title": "The Catcher in the Rye",
        "author": "J.D. Salinger",
        "description": "A coming-of-age story narrated by Holden Caulfield, a teenager dealing with alienation and loss in New York City.",
        "price": 11.49,
        "image_url": "https://via.placeholder.com/300x400?text=The+Catcher+in+the+Rye"
    },
    {
        "title": "Lord of the Flies",
        "author": "William Golding",
        "description": "A group of British boys stranded on an uninhabited island must govern themselves, with disastrous results.",
        "price": 10.49,
        "image_url": "https://via.placeholder.com/300x400?text=Lord+of+the+Flies"
    },
    {
        "title": "Harry Potter and the Sorcerer's Stone",
        "author": "J.K. Rowling",
        "description": "The first book in the beloved series about a young wizard discovering his magical heritage and attending Hogwarts.",
        "price": 14.99,
        "image_url": "https://via.placeholder.com/300x400?text=Harry+Potter"
    },
    {
        "title": "The Hobbit",
        "author": "J.R.R. Tolkien",
        "description": "A fantasy adventure following Bilbo Baggins as he joins a company of dwarves to reclaim their homeland from a dragon.",
        "price": 13.49,
        "image_url": "https://via.placeholder.com/300x400?text=The+Hobbit"
    }
]

def init_books():
    db = SessionLocal()
    try:
        # Check if books already exist
        existing_count = db.query(Book).count()
        if existing_count > 0:
            print(f"Database already contains {existing_count} books. Skipping initialization.")
            return
        
        # Add sample books
        for book_data in sample_books:
            book = Book(**book_data)
            db.add(book)
        
        db.commit()
        print(f"Successfully added {len(sample_books)} books to the database!")
    except Exception as e:
        print(f"Error initializing database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_books()

