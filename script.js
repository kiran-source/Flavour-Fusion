  // Product data with images and descriptions
        const products = [
    { 
        id: 1, 
        name: "Organic Apple", 
        price: 1.49, 
        emoji: "🍎",
        description: "Fresh organic apples, rich in fiber and antioxidants."
    },
    { 
        id: 2, 
        name: "Banana Bunch", 
        price: 0.99, 
        emoji: "🍌",
        description: "Naturally sweet bananas, perfect for snacks and smoothies."
    },
    { 
        id: 3, 
        name: "Carrots (1 lb)", 
        price: 1.29, 
        emoji: "🥕",
        description: "Crunchy and sweet organic carrots, great for juicing and cooking."
    },
    { 
        id: 4, 
        name: "Broccoli (1 lb)", 
        price: 1.99, 
        emoji: "🥦",
        description: "Fresh green broccoli, full of vitamins and fiber."
    },
    { 
        id: 5, 
        name: "Tomatoes (1 lb)", 
        price: 2.49, 
        emoji: "🍅",
        description: "Juicy red tomatoes, ideal for salads and sauces."
    },
    { 
        id: 6, 
        name: "Watermelon Slice", 
        price: 3.99, 
        emoji: "🍉",
        description: "Sweet and refreshing watermelon, perfect for summer days."
    },
    { 
        id: 7, 
        name: "Avocado (each)", 
        price: 2.29, 
        emoji: "🥑",
        description: "Creamy and nutrient-rich avocados for your toast or guacamole."
    },
    { 
        id: 8, 
        name: "Spinach (1 bunch)", 
        price: 1.79, 
        emoji: "🥬",
        description: "Tender and healthy spinach leaves, great for smoothies and salads."
    }
];

        // Shopping cart with localStorage persistence
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        let currentSection = 'products';

        // Initialize the app
        function init() {
            try {
                renderProducts();
                updateCartUI();
                setupEventListeners();
            } catch (error) {
                console.error('Initialization error:', error);
            }
        }

        // Render products
        function renderProducts() {
            const grid = document.getElementById('productsGrid');
            if (!grid) return;
            
            grid.innerHTML = products.map(product => `
                <div class="product-card">
                    <div class="product-image">${product.emoji}</div>
                    <div class="product-info">
                        <div class="product-name">${product.name}</div>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <p style="color: #666; font-size: 0.9rem; margin-bottom: 1rem;">${product.description}</p>
                        <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                            Add to Cart
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Add product to cart
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            if (!product) return;

            const existingItem = cart.find(item => item.id === productId);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ ...product, quantity: 1 });
            }

            saveCart();
            updateCartUI();
            
            // Show feedback
            const btn = event.target;
            const originalText = btn.textContent;
            btn.textContent = 'Added! ✓';
            btn.style.background = '#28a745';
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.background = '';
            }, 1000);
        }

        // Save cart to localStorage
        function saveCart() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Update cart UI
        function updateCartUI() {
            const cartCount = document.getElementById('cartCount');
            const cartItems = document.getElementById('cartItems');
            const cartTotal = document.getElementById('cartTotal');
            const checkoutBtn = document.getElementById('checkoutBtn');

            if (!cartCount || !cartItems || !cartTotal || !checkoutBtn) return;

            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            cartCount.textContent = totalItems;

            if (cart.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-state">
                        <h3>Your cart is empty</h3>
                        <p>Add some products to get started!</p>
                    </div>
                `;
                checkoutBtn.style.display = 'none';
            } else {
                cartItems.innerHTML = cart.map(item => `
                    <div class="cart-item">
                        <div class="item-info">
                            <strong>${item.name}</strong><br>
                            <span>$${item.price.toFixed(2)} each</span>
                        </div>
                        <div class="item-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                        </div>
                    </div>
                `).join('');
                checkoutBtn.style.display = 'inline-block';
            }

            cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
            
            // Update checkout total
            const checkoutTotal = document.getElementById('checkoutTotal');
            if (checkoutTotal) {
                checkoutTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
            }

            updateOrderSummary();
        }

        // Update quantity
        function updateQuantity(productId, change) {
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity += change;
                if (item.quantity <= 0) {
                    removeFromCart(productId);
                } else {
                    saveCart();
                    updateCartUI();
                }
            }
        }

        // Remove from cart
        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            saveCart();
            updateCartUI();
        }

        // Show section
        function showSection(sectionName) {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            
            const section = document.getElementById(sectionName);
            if (section) {
                section.classList.add('active');
                currentSection = sectionName;
            }

            if (sectionName === 'checkout') {
                updateOrderSummary();
            }
        }

        // Update order summary
        function updateOrderSummary() {
            const orderSummary = document.getElementById('orderSummary');
            if (!orderSummary) return;

            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = 15.99;
            const tax = totalPrice * 0.1;
            const finalTotal = totalPrice + shipping + tax;

            orderSummary.innerHTML = `
                <div style="margin-bottom: 1rem;">
                    ${cart.map(item => `
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                            <span>${item.name} × ${item.quantity}</span>
                            <span>$${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="border-top: 1px solid #eee; padding-top: 1rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Subtotal:</span>
                        <span>$${totalPrice.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Shipping:</span>
                        <span>$${shipping.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Tax:</span>
                        <span>$${tax.toFixed(2)}</span>
                    </div>
                </div>
            `;

            const checkoutTotal = document.getElementById('checkoutTotal');
            if (checkoutTotal) {
                checkoutTotal.textContent = `Total: $${finalTotal.toFixed(2)}`;
            }
        }

        // Select payment method
        function selectPayment(method) {
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('selected');
            });
            
            const target = event.currentTarget;
            if (target) {
                target.classList.add('selected');
            }
            
            const paymentInput = document.getElementById(method);
            if (paymentInput) {
                paymentInput.checked = true;
            }
            
            document.getElementById('paymentError').style.display = 'none';

            const cardDetails = document.getElementById('cardDetails');
            if (!cardDetails) return;

            if (method === 'credit' || method === 'debit') {
                cardDetails.style.display = 'block';
                cardDetails.querySelectorAll('input').forEach(input => {
                    input.required = true;
                });
            } else {
                cardDetails.style.display = 'none';
                cardDetails.querySelectorAll('input').forEach(input => {
                    input.required = false;
                });
            }
        }

        // Format card number
        function formatCardNumber(value) {
            return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim().substr(0, 19);
        }

        // Format expiry date
        function formatExpiryDate(value) {
            return value.replace(/\D/g, '').replace(/^(\d{2})/, '$1/').substr(0, 5);
        }

        // Setup event listeners
        function setupEventListeners() {
            // Card number formatting
            const cardNumberInput = document.querySelector('input[name="cardNumber"]');
            if (cardNumberInput) {
                cardNumberInput.addEventListener('input', function(e) {
                    e.target.value = formatCardNumber(e.target.value);
                });
            }
            
            // Expiry date formatting
            const expiryDateInput = document.querySelector('input[name="expiryDate"]');
            if (expiryDateInput) {
                expiryDateInput.addEventListener('input', function(e) {
                    e.target.value = formatExpiryDate(e.target.value);
                });
            }
            
            // CVV formatting
            const cvvInput = document.querySelector('input[name="cvv"]');
            if (cvvInput) {
                cvvInput.addEventListener('input', function(e) {
                    e.target.value = e.target.value.replace(/\D/g, '').substr(0, 4);
                });
            }

            // Form validation
            const checkoutForm = document.getElementById('checkoutForm');
            if (checkoutForm) {
                checkoutForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Reset error states
                    document.querySelectorAll('.form-group').forEach(group => {
                        group.classList.remove('error');
                    });
                    
                    // Validate payment method
                    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
                    if (!paymentMethod) {
                        document.getElementById('paymentError').style.display = 'block';
                        return;
                    }
                    
                    // Validate all required fields
                    let isValid = true;
                    const formData = new FormData(e.target);
                    
                    formData.forEach((value, name) => {
                        const input = document.querySelector(`[name="${name}"]`);
                        if (input && input.required && !value) {
                            input.closest('.form-group').classList.add('error');
                            isValid = false;
                        }
                    });
                    
                    // Additional validation for card details if credit/debit selected
                    if (paymentMethod.value === 'credit' || paymentMethod.value === 'debit') {
                        const cardNumber = formData.get('cardNumber');
                        const expiryDate = formData.get('expiryDate');
                        const cvv = formData.get('cvv');
                        const cardName = formData.get('cardName');
                        
                        if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
                            document.querySelector('[name="cardNumber"]').closest('.form-group').classList.add('error');
                            isValid = false;
                        }
                        
                        if (!expiryDate || !expiryDate.match(/^\d{2}\/\d{2}$/)) {
                            document.querySelector('[name="expiryDate"]').closest('.form-group').classList.add('error');
                            isValid = false;
                        }
                        
                        if (!cvv || cvv.length < 3) {
                            document.querySelector('[name="cvv"]').closest('.form-group').classList.add('error');
                            isValid = false;
                        }
                        
                        if (!cardName) {
                            document.querySelector('[name="cardName"]').closest('.form-group').classList.add('error');
                            isValid = false;
                        }
                    }
                    
                    if (!isValid) {
                        return;
                    }
                    
                    // If all valid, process order
                    processOrder(formData);
                });
            }
        }

        // Process order
        function processOrder(formData) {
            const orderData = Object.fromEntries(formData);
            
            // Simulate order processing
            const orderId = 'TS-' + Math.random().toString(36).substr(2, 9).toUpperCase();
            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const shipping = 15.99;
            const tax = totalPrice * 0.1;
            const finalTotal = totalPrice + shipping + tax;
            
            // Show success message
            const orderConfirmation = document.getElementById('orderConfirmation');
            if (orderConfirmation) {
                orderConfirmation.innerHTML = `
                    <p><strong>Order ID:</strong> ${orderId}</p>
                    <p><strong>Total Amount:</strong> $${finalTotal.toFixed(2)}</p>
                    <p><strong>Payment Method:</strong> ${getPaymentMethodName(orderData.paymentMethod)}</p>
                    <p><strong>Shipping Address:</strong><br>
                    ${orderData.fullName}<br>
                    ${orderData.address1}<br>
                    ${orderData.address2 ? orderData.address2 + '<br>' : ''}
                    ${orderData.city}, ${orderData.state} ${orderData.zipCode}<br>
                    ${orderData.country}</p>
                    <p><strong>Contact:</strong> ${orderData.email} | ${orderData.phone}</p>
                    <p><strong>Estimated Delivery:</strong> ${getDeliveryDate()}</p>
                `;
            }
            
            // Clear cart
            cart = [];
            saveCart();
            
            showSection('success');
        }

        // Get payment method name
        function getPaymentMethodName(method) {
            const methods = {
                'credit': 'Credit Card',
                'debit': 'Debit Card',
                'paypal': 'PayPal',
                'apple': 'Apple Pay',
                'google': 'Google Pay',
                'crypto': 'Cryptocurrency'
            };
            return methods[method] || method;
        }

        // Get estimated delivery date (3-5 business days from now)
        function getDeliveryDate() {
            const date = new Date();
            let daysToAdd = 3 + Math.floor(Math.random() * 3); // 3-5 days
            
            // Skip weekends
            while (daysToAdd > 0) {
                date.setDate(date.getDate() + 1);
                if (date.getDay() !== 0 && date.getDay() !== 6) {
                    daysToAdd--;
                }
            }
            
            return date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
            });
        }

         function startOver() {
            cart = [];
            saveCart();
            document.getElementById('checkoutForm').reset();
            document.querySelectorAll('.payment-option').forEach(option => {
                option.classList.remove('selected');
            });
            document.getElementById('cardDetails').style.display = 'none';
            updateCartUI();
            showSection('products');
        }

        // Initialize the app when page loads
        window.addEventListener('DOMContentLoaded', init);