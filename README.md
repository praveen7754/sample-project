# Online Bookstore Website

A full-stack online bookstore application with FastAPI backend and vanilla HTML/CSS/JavaScript frontend.

## Features

- **Home Page**: Display featured books with images, titles, descriptions, and prices
- **Book Details Page**: View detailed information about each book with option to add to cart
- **Shopping Cart**: Add/remove books, update quantities, and checkout
- **Order Management**: Complete purchase with user details and mark purchased books as unavailable
- **Database Integration**: MySQL database for books, users, and orders

## Tech Stack

- **Frontend**: HTML, CSS, JavaScript (vanilla)
- **Backend**: Python FastAPI
- **Database**: MySQL
- **Package Manager**: pip

## Project Structure

```
Bookstore Website/
├── backend/
│   ├── main.py              # FastAPI application and API endpoints
│   ├── init_db.py           # Database initialization script
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
├── frontend/
│   ├── index.html           # Home page
│   ├── book-details.html    # Book details page
│   ├── cart.html            # Shopping cart page
│   ├── css/
│   │   └── style.css        # Main stylesheet
│   └── js/
│       ├── common.js        # Shared utilities and cart management
│       ├── home.js          # Home page logic
│       ├── book-details.js  # Book details page logic
│       └── cart.js          # Shopping cart logic
└── README.md
```

## Setup Instructions

### Prerequisites

- Python 3.8 or higher
- MySQL Server
- pip (Python package manager)

### 1. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE bookstore;
```

2. Update the database connection in `backend/.env` file:
```
DATABASE_URL=mysql+pymysql://username:password@localhost/bookstore
```

Replace `username` and `password` with your MySQL credentials.

### 2. Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On Linux/Mac:
     ```bash
     source venv/bin/activate
     ```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create `.env` file:
```bash
# Copy the example file and update with your database credentials
# Windows: copy .env.example .env
# Linux/Mac: cp .env.example .env
```

6. Initialize the database with sample data:
```bash
python init_db.py
```

7. Start the FastAPI server:
```bash
python main.py
```

The API will be available at `http://localhost:8000`

### 3. Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Open `index.html` in a web browser, or use a local web server:

   **Using Python (if available):**
   ```bash
   python -m http.server 8001
   ```
   Then open `http://localhost:8001` in your browser.

   **Using Node.js http-server (if available):**
   ```bash
   npx http-server -p 8001
   ```

   **Or simply:**
   - Open `index.html` directly in your browser (note: some browsers may have CORS restrictions)

## API Endpoints

### GET `/api/books/featured`
Returns a list of all featured books (not purchased).

### GET `/api/books/{book_id}`
Returns detailed information about a specific book.

### POST `/api/orders`
Creates a new order with user information and cart items. Marks purchased books as unavailable.

**Request Body:**
```json
{
  "user": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "123-456-7890",
    "address": "123 Main St"
  },
  "items": [
    {
      "book_id": 1,
      "quantity": 2
    }
  ]
}
```

## Usage

1. **Browse Books**: Visit the home page to see featured books
2. **View Details**: Click on any book to see detailed information
3. **Add to Cart**: Click "Add to Cart" button on book details page
4. **Manage Cart**: View cart, update quantities, or remove items
5. **Checkout**: Fill in your information and complete the purchase
6. **Purchased Books**: Once purchased, books will no longer appear on the home page

## Notes

- The cart is stored in browser's localStorage
- Purchased books are marked in the database and hidden from the featured books list
- Make sure both the backend server (port 8000) and frontend are running for full functionality
- If you encounter CORS issues, the backend is configured to allow all origins in development

## Troubleshooting

1. **Database Connection Error**: 
   - Verify MySQL is running
   - Check database credentials in `.env` file
   - Ensure database `bookstore` exists

2. **API Not Responding**:
   - Ensure backend server is running on port 8000
   - Check for errors in the terminal

3. **Books Not Loading**:
   - Run `python init_db.py` to populate sample data
   - Check browser console for errors
   - Verify API base URL in `frontend/js/common.js`

## License

This project is for educational purposes.

