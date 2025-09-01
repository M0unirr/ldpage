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

// Sample product data
let selectedProduct = {
    id: 1,
    name: "قميص",
    description: "قميص عالي الجودة مع مميزات رائعة",
    price: "2500DA",
    colors: {
        white: { name: "أبيض", image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400" },
        beige: { name: "بيج", image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400" },
        black: { name: "أسود", image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400" }
    },
    selectedColor: "white"
};

// Initialize products array for search functionality  
const products = [
    {
        id: 1,
        name: "قميص أبيض",
        description: "قميص عالي الجودة مع مميزات رائعة",
        price: "2500DA",
        category: "clothing",
        image: "https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 2,
        name: "قميص بيج",
        description: "قميص أنيق بلون بيج هادئ",
        price: "2500DA",
        category: "clothing",
        image: "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
        id: 3,
        name: "قميص أسود",
        description: "قميص كلاسيكي باللون الأسود",
        price: "2500DA",
        category: "clothing",
        image: "https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=400"
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
        openPurchaseModal(product);
    }
}

// Color selection functionality
function initializeColorSelection() {
    const colorButtons = document.querySelectorAll('.color-btn');
    const productImage = document.getElementById('productImage');

    // Initialize selectedProduct if not already set
    if (!selectedProduct) {
        selectedProduct = products[0];
    }

    // Set initial image
    if (productImage && selectedProduct && selectedProduct.colors && selectedProduct.colors[selectedProduct.selectedColor]) {
        productImage.src = selectedProduct.colors[selectedProduct.selectedColor].image;
        productImage.alt = `قميص ${selectedProduct.colors[selectedProduct.selectedColor].name}`;
    }

    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            colorButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');

            // Update selected color
            const color = this.getAttribute('data-color');
            if (selectedProduct && selectedProduct.colors && selectedProduct.colors[color]) {
                selectedProduct.selectedColor = color;

                // Update product image
                if (productImage) {
                    productImage.src = selectedProduct.colors[color].image;
                    productImage.alt = `قميص ${selectedProduct.colors[color].name}`;
                }
            }
        });
    });
}

function openPurchaseModal(product = selectedProduct) {
    if (!product) {
        console.error('Product data is not properly initialized');
        return;
    }

    // For products from search, use the product directly
    // For main product, use color selection
    let productData = product;
    let productImage = product.image;
    let productName = product.name;

    if (product === selectedProduct && selectedProduct.colors) {
        const selectedColorData = selectedProduct.colors[selectedProduct.selectedColor];
        productImage = selectedColorData.image;
        productName = `${selectedProduct.name} ${selectedColorData.name}`;
    }

    // Remove existing modal if any
    const existingModal = document.getElementById('purchaseModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Create modal backdrop
    const modal = document.createElement('div');
    modal.className = 'purchase-modal';
    modal.id = 'purchaseModal';

    modal.innerHTML = `
        <div class="purchase-content">
            <button class="close-purchase" onclick="closePurchaseModal()">
                <i class="fas fa-times"></i>
            </button>
            <h3>شراء ${productName}</h3>
            <div class="product-summary">
                <img src="${productImage}" alt="${productName}">
                <div class="product-details">
                    <h4>${productName}</h4>
                    <p class="price">${productData.price}</p>
                </div>
            </div>
            <form id="purchaseForm" class="purchase-form">
                <div class="form-group">
                    <label for="quantity">عدد القطع:</label>
                    <input type="number" id="quantity" name="quantity" min="1" value="1" required>
                </div>
                <div class="form-group">
                    <label for="wilaya">الولاية:</label>
                    <input type="text" id="wilaya" name="wilaya" placeholder="أدخل اسم الولاية" required>
                </div>
                <div class="form-group">
                    <label for="phone">رقم الهاتف:</label>
                    <input type="tel" id="phone" name="phone" placeholder="أدخل رقم الهاتف" required>
                </div>
                <button type="submit" class="confirm-purchase-btn">
                    تأكيد الطلب
                </button>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    // Animate modal in
    setTimeout(() => {
        modal.classList.add('active');
    }, 10);

    // Add form submit handler
    document.getElementById('purchaseForm').addEventListener('submit', handlePurchaseSubmit);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closePurchaseModal() {
    const modal = document.getElementById('purchaseModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => {
            document.body.removeChild(modal);
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

function handlePurchaseSubmit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const quantity = formData.get('quantity');
    const wilaya = formData.get('wilaya');
    const phone = formData.get('phone');

    // Here you can send the order to your backend
    console.log('Order details:', { 
        product: selectedProduct.name,
        quantity, 
        wilaya, 
        phone 
    });

    showNotification(`تم تأكيد طلبك! سيتم التواصل معك قريباً`);
    closePurchaseModal();
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
    // Initialize selectedProduct
    selectedProduct = products[0];

    // Initialize color selection
    initializeColorSelection();

    // Display products in search page
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
    if (searchPage) {
        searchPage.addEventListener('click', function(e) {
            if (e.target === searchPage) {
                closeSearchPage();
            }
        });
    }

    // Add keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && searchPage && searchPage.classList.contains('active')) {
            closeSearchPage();
        }
        if (e.key === 'Escape') {
            const modal = document.getElementById('purchaseModal');
            if (modal) {
                closePurchaseModal();
            }
        }
    });
});