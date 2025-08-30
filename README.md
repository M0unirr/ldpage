# QAMIS SHOP Landing Page

A modern, responsive landing page for QAMIS SHOP with an interactive search feature and beautiful product display.

## Features

- **Modern Design**: Clean, professional appearance with gradient backgrounds and glass-morphism effects
- **Interactive Search**: Click on the search bar to open a full-screen product search page
- **Blur Effect**: Main page gets blurred and scaled down when search is active
- **Responsive Layout**: Works perfectly on desktop, tablet, and mobile devices
- **Product Management**: Easy to add, remove, or modify products
- **Shopping Cart**: Basic cart functionality with localStorage
- **Smooth Animations**: Beautiful transitions and hover effects

## How It Works

1. **Main Landing Page**: Displays your brand, hero section, and featured products
2. **Search Interaction**: Click anywhere on the search bar to open the product search page
3. **Background Blur**: The main page automatically blurs and scales down
4. **Product Search**: Users can search through all products with real-time filtering
5. **Easy Navigation**: Close button or click outside to return to main page

## File Structure

```
├── index.html          # Main HTML structure
├── styles.css          # All styling and animations
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Customization

### Adding Your Products

Edit the `products` array in `script.js`:

```javascript
const products = [
    {
        id: 1,
        name: "Your Product Name",
        description: "Product description",
        price: "$99.99",
        category: "category",
        image: "path/to/your/image.jpg"
    },
    // Add more products...
];
```

### Changing Colors

Modify the CSS variables in `styles.css`:

```css
:root {
    --primary-color: #4A90E2;
    --secondary-color: #50C878;
    --accent-color: #F39C12;
}
```

### Updating Brand Information

Edit the header section in `index.html`:

```html
<div class="logo">
    <h1>YOUR SHOP NAME</h1>
    <p>Your tagline here</p>
</div>
```

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile browsers

## Getting Started

1. **Download** all files to your web server
2. **Open** `index.html` in a web browser
3. **Customize** the content, products, and styling
4. **Upload** to your web hosting service

## Features for E-commerce

- **Product Search**: Real-time filtering by name, description, or category
- **Shopping Cart**: Basic cart functionality (can be extended)
- **Responsive Design**: Mobile-friendly shopping experience
- **Product Cards**: Beautiful product presentation
- **Call-to-Action**: Clear "Buy Now" and "Add to Cart" buttons

## Advanced Customization

### Adding Payment Integration

You can integrate payment gateways like:
- Stripe
- PayPal
- Square
- Your preferred payment processor

### Database Integration

Replace the static products array with:
- MySQL/PostgreSQL database
- API calls to your backend
- Headless CMS integration

### Analytics

Add tracking with:
- Google Analytics
- Facebook Pixel
- Custom tracking scripts

## Support

For questions or customization help, refer to the code comments or modify the files as needed.

## License

This landing page template is free to use and modify for your business needs.

---

**QAMIS SHOP** - Premium Quality Products
