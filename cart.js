// Load cart page
async function loadCartPage() {
    const container = document.getElementById('cart-container');
    const checkoutContainer = document.getElementById('checkout-form-container');
    
    if (cart.length === 0) {
        container.innerHTML = `
            <div class="empty-cart">
                <h2>Your cart is empty</h2>
                <p>Start shopping to add books to your cart!</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Browse Books</a>
            </div>
        `;
        checkoutContainer.style.display = 'none';
        return;
    }
    
    try {
        const cartItems = await getCartItemsWithDetails();
        const total = calculateTotal(cartItems);
        
        container.innerHTML = `
            ${cartItems.map(item => `
                <div class="cart-item">
                    <img src="${item.book.image_url || 'https://via.placeholder.com/100x120?text=Book'}" 
                         alt="${item.book.title}" 
                         class="cart-item-image"
                         onerror="this.src='https://via.placeholder.com/100x120?text=Book'">
                    <div class="cart-item-info">
                        <h3>${item.book.title}</h3>
                        <p>by ${item.book.author}</p>
                    </div>
                    <div class="cart-item-price">$${item.book.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.book_id}, ${item.quantity - 1})">-</button>
                        <input type="number" 
                               class="quantity-input" 
                               value="${item.quantity}" 
                               min="1"
                               onchange="updateQuantity(${item.book_id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="updateQuantity(${item.book_id}, ${item.quantity + 1})">+</button>
                    </div>
                    <button class="btn btn-danger" onclick="removeFromCart(${item.book_id})" style="padding: 0.5rem;">Remove</button>
                </div>
            `).join('')}
            <div class="cart-total">
                <h2>Total:</h2>
                <span class="total-amount">$${total.toFixed(2)}</span>
            </div>
        `;
        
        checkoutContainer.style.display = 'block';
    } catch (error) {
        console.error('Error loading cart:', error);
        container.innerHTML = '<p style="text-align: center; color: #e74c3c;">Error loading cart. Please try again later.</p>';
    }
}

// Handle checkout form submission
async function handleCheckout(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    const userInfo = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address')
    };
    
    const orderData = {
        user: userInfo,
        items: cart
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(orderData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to place order');
        }
        
        const order = await response.json();
        
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartBadge();
        
        // Show success message
        const container = document.getElementById('cart-container');
        container.innerHTML = `
            <div class="success-message">
                <h2>Order Placed Successfully!</h2>
                <p>Your order #${order.id} has been confirmed.</p>
                <p>Total amount: $${order.total_amount.toFixed(2)}</p>
                <p style="margin-top: 1rem;">Thank you for your purchase!</p>
                <a href="index.html" class="btn btn-primary" style="margin-top: 1rem;">Continue Shopping</a>
            </div>
        `;
        
        document.getElementById('checkout-form-container').style.display = 'none';
    } catch (error) {
        console.error('Error placing order:', error);
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = `Error: ${error.message}`;
        form.insertBefore(errorMsg, form.firstChild);
        
        setTimeout(() => {
            errorMsg.remove();
        }, 5000);
    }
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    loadCartPage();
    
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', handleCheckout);
    }
});

