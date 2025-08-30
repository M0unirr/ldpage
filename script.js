// DOM Elements
const searchBar = document.getElementById('searchBar');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const mainPage = document.getElementById('mainPage');
const searchPage = document.getElementById('searchPage');
const closeBtn = document.getElementById('closeBtn');
const productSearchInput = document.getElementById('productSearchInput');

// Event Listeners
searchBar.addEventListener('click', openSearchPage);
searchBtn.addEventListener('click', openSearchPage);
searchInput.addEventListener('click', openSearchPage);
closeBtn.addEventListener('click', closeSearchPage);

// Product search functionality
productSearchInput.addEventListener('input', filterProducts);

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

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    // Display initial products
    displayProducts(products);
    
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

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
        
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
});
