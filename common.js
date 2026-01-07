// API Base URL
const API_BASE_URL = 'http://localhost:8000';

// Cart management
let cart = JSON.parse(localStorage.getItem('cart') || '[]');

// Update cart badge
function updateCartBadge() {
    const badge = document.getElementById('cart-badge');
    if (badge) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Add to cart
function addToCart(bookId, quantity = 1) {
    const existingItem = cart.find(item => item.book_id === bookId);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ book_id: bookId, quantity: quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
}

// Remove from cart
function removeFromCart(bookId) {
    cart = cart.filter(item => item.book_id !== bookId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartBadge();
    if (window.location.pathname.includes('cart.html')) {
        loadCartPage();
    }
}

// Update quantity
function updateQuantity(bookId, quantity) {
    const item = cart.find(item => item.book_id === bookId);
    if (item) {
        if (quantity <= 0) {
            removeFromCart(bookId);
        } else {
            item.quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
            if (window.location.pathname.includes('cart.html')) {
                loadCartPage();
            }
        }
    }
}

// Get cart items with book details
async function getCartItemsWithDetails() {
    const items = [];
    for (const cartItem of cart) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/books/${cartItem.book_id}`);
            if (response.ok) {
                const book = await response.json();
                items.push({
                    ...cartItem,
                    book: book
                });
            }
        } catch (error) {
            console.error(`Error fetching book ${cartItem.book_id}:`, error);
        }
    }
    return items;
}

// Calculate total
function calculateTotal(cartItems) {
    return cartItems.reduce((sum, item) => {
        return sum + (item.book.price * item.quantity);
    }, 0);
}

// Initialize cart badge on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartBadge();
});

