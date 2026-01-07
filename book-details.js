// Load book details
async function loadBookDetails() {
    const container = document.getElementById('book-details-container');
    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');
    
    if (!bookId) {
        container.innerHTML = '<p style="text-align: center; color: #e74c3c;">Book ID not provided.</p>';
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/books/${bookId}`);
        if (!response.ok) {
            if (response.status === 404) {
                container.innerHTML = '<p style="text-align: center; color: #e74c3c;">Book not found.</p>';
                return;
            }
            throw new Error('Failed to fetch book details');
        }
        
        const book = await response.json();
        
        container.innerHTML = `
            <img src="${book.image_url || 'https://via.placeholder.com/400x600?text=Book'}" 
                 alt="${book.title}" 
                 class="book-detail-image"
                 onerror="this.src='https://via.placeholder.com/400x600?text=Book'">
            <div class="book-detail-info">
                <h1>${book.title}</h1>
                <p class="book-detail-author">by ${book.author}</p>
                <p class="book-detail-price">$${book.price.toFixed(2)}</p>
                <p class="book-detail-description">${book.description || 'No description available.'}</p>
                <button onclick="addToCartAndNotify(${book.id})" class="btn btn-primary">
                    Add to Cart
                </button>
            </div>
        `;
    } catch (error) {
        console.error('Error loading book details:', error);
        container.innerHTML = '<p style="text-align: center; color: #e74c3c;">Error loading book details. Please try again later.</p>';
    }
}

// Add to cart and show notification
function addToCartAndNotify(bookId) {
    addToCart(bookId, 1);
    
    // Show notification
    const notification = document.createElement('div');
    notification.className = 'success-message';
    notification.style.position = 'fixed';
    notification.style.top = '80px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.minWidth = '250px';
    notification.textContent = 'Book added to cart!';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadBookDetails();
});

