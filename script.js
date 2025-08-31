// DOM Elements
const searchBar = document.getElementById('searchBar');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const mainPage = document.getElementById('mainPage');
const searchPage = document.getElementById('searchPage');
const closeBtn = document.getElementById('closeBtn');
const productSearchInput = document.getElementById('productSearchInput');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

// Auth Modal Elements
const authModal = document.getElementById('authModal');
const closeAuth = document.getElementById('closeAuth');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const emailLoginForm = document.getElementById('emailLoginForm');
const emailRegisterForm = document.getElementById('emailRegisterForm');
const googleLoginBtn = document.getElementById('googleLoginBtn');
const googleRegisterBtn = document.getElementById('googleRegisterBtn');
const showRegister = document.getElementById('showRegister');
const showLogin = document.getElementById('showLogin');
const authTabs = document.querySelectorAll('.auth-tab');

// Event Listeners
searchBar.addEventListener('click', openSearchPage);
searchBtn.addEventListener('click', openSearchPage);
searchInput.addEventListener('click', openSearchPage);
closeBtn.addEventListener('click', closeSearchPage);
loginBtn.addEventListener('click', showAuthModal);
registerBtn.addEventListener('click', showAuthModal);

// Auth Modal Events
closeAuth.addEventListener('click', hideAuthModal);
showRegister.addEventListener('click', showRegisterForm);
showLogin.addEventListener('click', showLoginForm);
emailLoginForm.addEventListener('submit', handleEmailLogin);
emailRegisterForm.addEventListener('submit', handleEmailRegister);
googleLoginBtn.addEventListener('click', handleGoogleLogin);
googleRegisterBtn.addEventListener('click', handleGoogleRegister);

// Auth Tab Events
authTabs.forEach(tab => {
    tab.addEventListener('click', () => switchAuthTab(tab));
});

// Product search functionality
productSearchInput.addEventListener('input', filterProducts);

// User authentication state
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Google OAuth configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual Google Client ID
const GOOGLE_OAUTH_SCOPE = 'profile email';

// Sample product data (you can replace this with your actual products)
const products = [
    {
        id: 1,
        name: "Product Item 1",
        description: "High-quality product with amazing features",
        price: "$99.99",
        category: "electronics",
        image: "https://via.placeholder.com/200x200/4A90E2/FFFFFF?text=Item+1"
    },
    {
        id: 2,
        name: "Product Item 2",
        description: "Premium quality at affordable price",
        price: "$149.99",
        category: "clothing",
        image: "https://via.placeholder.com/200x200/50C878/FFFFFF?text=Item+2"
    },
    {
        id: 3,
        name: "Product Item 3",
        description: "Best value for your money",
        price: "$79.99",
        category: "home",
        image: "https://via.placeholder.com/200x200/F39C12/FFFFFF?text=Item+3"
    },
    {
        id: 4,
        name: "Product Item 4",
        description: "Exclusive product with unique features",
        price: "$199.99",
        category: "electronics",
        image: "https://via.placeholder.com/200x200/E74C3C/FFFFFF?text=Item+4"
    },
    {
        id: 5,
        name: "Product Item 5",
        description: "Limited edition premium product",
        price: "$299.99",
        category: "luxury",
        image: "https://via.placeholder.com/200x200/9B59B6/FFFFFF?text=Item+5"
    },
    {
        id: 6,
        name: "Product Item 6",
        description: "High-performance product",
        price: "$399.99",
        category: "sports",
        image: "https://via.placeholder.com/200x200/1ABC9C/FFFFFF?text=Item+6"
    }
];

// Auth Functions
function showAuthModal(e) {
    e.preventDefault();
    authModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Show login form by default when clicking login button
    if (e.target.id === 'loginBtn' || e.target.closest('#loginBtn')) {
        showLoginForm();
    } else if (e.target.id === 'registerBtn' || e.target.closest('#registerBtn')) {
        showRegisterForm();
    }
}

function hideAuthModal() {
    authModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function showLoginForm() {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
}

function showRegisterForm() {
    registerForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
}

function switchAuthTab(clickedTab) {
    // Remove active class from all tabs
    authTabs.forEach(tab => tab.classList.remove('active'));
    
    // Add active class to clicked tab
    clickedTab.classList.add('active');
    
    // Hide all panels
    document.querySelectorAll('.auth-panel').forEach(panel => {
        panel.classList.remove('active');
    });
    
    // Show corresponding panel
    const formType = clickedTab.getAttribute('data-form');
    document.getElementById(formType).classList.add('active');
}

async function handleEmailLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;
    
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateAuthUI();
            hideAuthModal();
            showNotification('Login successful!');
        } else {
            showNotification(data.error || 'Login failed');
        }
    } catch (error) {
        console.error('Login error:', error);
        showNotification('Login failed. Please try again.');
    }
}

async function handleEmailRegister(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelectorAll('input[type="password"]')[0].value;
    const confirmPassword = formData.get('confirmPassword') || e.target.querySelectorAll('input[type="password"]')[1].value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match');
        return;
    }
    
    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            updateAuthUI();
            hideAuthModal();
            showNotification('Registration successful!');
        } else {
            showNotification(data.error || 'Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration failed. Please try again.');
    }
}


// Functions
function openSearchPage() {
    // Add blur effect to main page
    mainPage.classList.add('blurred');
    
    // Show search page with smooth animation
    searchPage.classList.add('active');
    
    // Focus on the search input
    setTimeout(() => {
        productSearchInput.focus();
    }, 500);
    
    // Prevent body scroll when search page is open
    document.body.style.overflow = 'hidden';
}

function closeSearchPage() {
    // Remove blur effect from main page
    mainPage.classList.remove('blurred');
    
    // Hide search page with smooth animation
    searchPage.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = 'auto';
    
    // Clear search input
    productSearchInput.value = '';
    
    // Reset product display
    displayProducts(products);
}

function filterProducts() {
    const searchTerm = productSearchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        displayProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    
    displayProducts(filteredProducts);
}

function displayProducts(productsToShow) {
    const productsContainer = document.querySelector('.products-container');
    
    if (productsToShow.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-results">
                <h3>No products found</h3>
                <p>Try adjusting your search terms</p>
            </div>
        `;
        return;
    }
    
    productsContainer.innerHTML = productsToShow.map(product => `
        <div class="product-item" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}">
            <div class="product-info">
                <h4>${product.name}</h4>
                <p class="description">${product.description}</p>
                <p class="price">${product.price}</p>
                <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        // Add to cart functionality (you can implement your own cart system)
        showNotification(`Added ${product.name} to cart!`);
        
        // You can store cart items in localStorage or send to your backend
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #50C878;
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Google Authentication Functions
function handleGoogleLogin() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile',
            callback: (response) => {
                if (response.access_token) {
                    // Get user info using the access token
                    fetchUserInfo(response.access_token, 'login');
                }
            },
        }).requestAccessToken();
    } else {
        showNotification('Google Sign-In is not available. Please try again later.');
    }
}

// Database API Functions
async function fetchProductsFromDB() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        displayProducts(products);
        return products;
    } catch (error) {
        console.error('Error fetching products from database:', error);
        // Fallback to local products if database fails
        displayProducts(products);
    }
}

async function saveUserToDB(user) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                googleId: user.id,
                name: user.name,
                email: user.email,
                picture: user.picture
            })
        });
        
        if (response.ok) {
            console.log('User saved to database successfully');
        }
    } catch (error) {
        console.error('Error saving user to database:', error);
    }
}

async function createOrder(orderData) {
    try {
        const response = await fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData)
        });
        
        if (response.ok) {
            const result = await response.json();
            showNotification('Order created successfully!');
            return result.id;
        }
    } catch (error) {
        console.error('Error creating order:', error);
        showNotification('Failed to create order. Please try again.');
    }
}

function handleGoogleRegister() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'email profile',
            callback: (response) => {
                if (response.access_token) {
                    // Get user info using the access token
                    fetchUserInfo(response.access_token, 'register');
                }
            },
        }).requestAccessToken();
    } else {
        showNotification('Google Sign-In is not available. Please try again later.');
    }
}

function fetchUserInfo(accessToken, action) {
    fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
    .then(response => response.json())
    .then(userData => {
        const user = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            picture: userData.picture,
            accessToken: accessToken
        };
        
        if (action === 'login') {
            handleSuccessfulLogin(user);
        } else {
            handleSuccessfulRegister(user);
        }
    })
    .catch(error => {
        console.error('Error fetching user info:', error);
        showNotification('Failed to get user information. Please try again.');
    });
}

function handleSuccessfulLogin(user) {
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    updateAuthUI();
    showNotification(`Welcome back, ${user.name}!`);
    
    // Save user to database
    saveUserToDB(user);
}

function handleSuccessfulRegister(user) {
    currentUser = user;
    localStorage.setItem('user', JSON.stringify(user));
    updateAuthUI();
    showNotification(`Welcome to QAMIS SHOP, ${user.name}!`);
    
    // Save user to database
    saveUserToDB(user);
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    updateAuthUI();
    showNotification('You have been logged out successfully.');
}

function updateAuthUI() {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser) {
        // User is logged in, show profile
        const avatarSrc = currentUser.picture || `https://via.placeholder.com/35x35/4A90E2/FFFFFF?text=${currentUser.name.charAt(0)}`;
        authButtons.innerHTML = `
            <div class="user-profile">
                <div class="user-info" title="${currentUser.name}">
                    <i class="fas fa-user-circle"></i>
                </div>
                <button class="logout-btn" onclick="handleLogout()" title="Logout">
                    <i class="fas fa-sign-out-alt"></i>
                </button>
            </div>
        `;
    } else {
        // User is not logged in, show auth buttons
        authButtons.innerHTML = `
            <button class="auth-btn login-btn" id="loginBtn">
                <i class="fab fa-google"></i>
                Login
            </button>
            <button class="auth-btn register-btn" id="registerBtn">
                <i class="fab fa-google"></i>
                Register
            </button>
        `;
        
        // Re-attach event listeners
        document.getElementById('loginBtn').addEventListener('click', showAuthModal);
        document.getElementById('registerBtn').addEventListener('click', showAuthModal);
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Check for existing user session
    const savedUser = localStorage.getItem('currentUser') || localStorage.getItem('user');
    const savedToken = localStorage.getItem('authToken');
    
    if (savedUser) {
        try {
            currentUser = JSON.parse(savedUser);
            if (savedToken) {
                authToken = savedToken;
            }
            updateAuthUI();
        } catch (error) {
            console.error('Error parsing saved user data:', error);
            localStorage.removeItem('user');
            localStorage.removeItem('currentUser');
        }
    }
    
    // Try to load products from database, fallback to local products
    fetchProductsFromDB();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Add click outside to close search page
    searchPage.addEventListener('click', function(e) {
        if (e.target === searchPage) {
            closeSearchPage();
        }
    });
    
    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchPage.classList.contains('active')) {
            closeSearchPage();
        }
    });
});

