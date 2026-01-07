// Load featured books
async function loadFeaturedBooks() {
    const container = document.getElementById('books-container');
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/books/featured`);
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        
        const books = await response.json();
        
        if (books.length === 0) {
            container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #666;">No featured books available at the moment.</p>';
            return;
        }
        
        container.innerHTML = books.map(book => `
            <a href="book-details.html?id=${book.id}" class="book-card">
                <img src="${book.image_url || 'https://via.placeholder.com/300x400?text=Book'}" 
                     alt="${book.title}" 
                     class="book-image"
                     onerror="this.src='https://via.placeholder.com/300x400?text=Book'">
                <div class="book-info">
                    <h2 class="book-title">${book.title}</h2>
                    <p class="book-author">by ${book.author}</p>
                    <p class="book-description">${book.description || 'No description available.'}</p>
                    <p class="book-price">$${book.price.toFixed(2)}</p>
                </div>
            </a>
        `).join('');
    } catch (error) {
        console.error('Error loading books:', error);
        container.innerHTML = '<p style="text-align: center; grid-column: 1/-1; color: #e74c3c;">Error loading books. Please try again later.</p>';
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadFeaturedBooks();
});

