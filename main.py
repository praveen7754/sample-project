from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import os
from dotenv import load_dotenv

load_dotenv()

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:password@localhost/bookstore")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database Models
class Book(Base):
    __tablename__ = "books"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    description = Column(String(1000))
    price = Column(Float, nullable=False)
    image_url = Column(String(500))
    is_purchased = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False, unique=True)
    phone = Column(String(20))
    address = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    orders = relationship("Order", back_populates="user")

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    total_amount = Column(Float, nullable=False)
    status = Column(String(50), default="completed")
    created_at = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    book_id = Column(Integer, ForeignKey("books.id"))
    quantity = Column(Integer, default=1)
    price = Column(Float, nullable=False)
    order = relationship("Order", back_populates="items")

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic Models
class BookResponse(BaseModel):
    id: int
    title: str
    author: str
    description: Optional[str]
    price: float
    image_url: Optional[str]
    is_purchased: bool
    
    class Config:
        from_attributes = True

class CartItem(BaseModel):
    book_id: int
    quantity: int = 1

class UserInfo(BaseModel):
    name: str
    email: str
    phone: Optional[str]
    address: Optional[str]

class OrderRequest(BaseModel):
    user: UserInfo
    items: List[CartItem]

class OrderResponse(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI(title="Bookstore API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API Endpoints
@app.get("/")
def read_root():
    return {"message": "Bookstore API"}

@app.get("/api/books/featured", response_model=List[BookResponse])
def get_featured_books():
    """Get list of featured books (not purchased)"""
    db = SessionLocal()
    try:
        books = db.query(Book).filter(Book.is_purchased == False).all()
        return books
    finally:
        db.close()

@app.get("/api/books/{book_id}", response_model=BookResponse)
def get_book_details(book_id: int):
    """Get detailed information about a specific book"""
    db = SessionLocal()
    try:
        book = db.query(Book).filter(Book.id == book_id).first()
        if not book:
            raise HTTPException(status_code=404, detail="Book not found")
        return book
    finally:
        db.close()

@app.post("/api/orders", response_model=OrderResponse)
def create_order(order_request: OrderRequest):
    """Create a new order and mark books as purchased"""
    db = SessionLocal()
    try:
        # Get or create user
        user = db.query(User).filter(User.email == order_request.user.email).first()
        if not user:
            user = User(
                name=order_request.user.name,
                email=order_request.user.email,
                phone=order_request.user.phone,
                address=order_request.user.address
            )
            db.add(user)
            db.flush()
        
        # Calculate total and create order items
        total_amount = 0.0
        order_items = []
        
        for item in order_request.items:
            book = db.query(Book).filter(Book.id == item.book_id).first()
            if not book:
                raise HTTPException(status_code=404, detail=f"Book {item.book_id} not found")
            if book.is_purchased:
                raise HTTPException(status_code=400, detail=f"Book {book.title} is already purchased")
            
            item_total = book.price * item.quantity
            total_amount += item_total
            
            order_items.append(OrderItem(
                book_id=book.id,
                quantity=item.quantity,
                price=book.price
            ))
        
        # Create order
        order = Order(
            user_id=user.id,
            total_amount=total_amount,
            status="completed"
        )
        db.add(order)
        db.flush()
        
        # Add order items
        for item in order_items:
            item.order_id = order.id
            db.add(item)
        
        # Mark books as purchased
        for item in order_request.items:
            book = db.query(Book).filter(Book.id == item.book_id).first()
            book.is_purchased = True
        
        db.commit()
        db.refresh(order)
        return order
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=str(e))
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

