const express = require("express");
const cors = require("cors");
const app = express();

// Enhanced CORS configuration
const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Product categories mapping with more specific categories
const productCategories = {
  "Laptop": "Electronics",
  "Phone": "Electronics",
  "Headphones": "Electronics",
  "Tablet": "Electronics",
  "Camera": "Electronics",
  
  "Watch": "Fashion",
  "Shoes": "Fashion",
  "Sunglasses": "Fashion",
  "Backpack": "Fashion"
};

// Subcategories for more specific filtering
const productSubcategories = {
  "Laptop": "Computers",
  "Phone": "Mobile",
  "Headphones": "Audio",
  "Tablet": "Computers",
  "Camera": "Photography",
  "Watch": "Watches",
  "Shoes": "Footwear",
  "Sunglasses": "Accessories",
  "Backpack": "Bags"
};

// Category definitions with descriptions
const categories = {
  "Electronics": {
    name: "Electronics",
    description: "Gadgets and electronic devices"
  },
  "Fashion": {
    name: "Fashion",
    description: "Clothing and accessories"
  }
};

// Subcategory definitions
const subcategories = {
  "Computers": { name: "Computers", parent: "Electronics" },
  "Mobile": { name: "Mobile", parent: "Electronics" },
  "Audio": { name: "Audio", parent: "Electronics" },
  "Photography": { name: "Photography", parent: "Electronics" },
  "Wearables": { name: "Wearables", parent: "Electronics" },
  "Watches": { name: "Watches", parent: "Fashion" },
  "Footwear": { name: "Footwear", parent: "Fashion" },
  "Accessories": { name: "Accessories", parent: "Fashion" },
  "Bags": { name: "Bags", parent: "Fashion" }
};

const productImages = {
  "Laptop": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop&q=80",
  "Phone": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&h=600&fit=crop&q=80",
  "Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80",
  "Shoes": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80",
  "Watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80",
  "Camera": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&h=600&fit=crop&q=80",
  "Tablet": "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&h=600&fit=crop&q=80",
  "Backpack": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80",
  "Sunglasses": "https://images.unsplash.com/photo-1577803645773-f96470509666?w=600&h=600&fit=crop&q=80&auto=format&fit=crop", // High-quality sunglasses image
  "Smart Watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80",
  "Smartwatch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80"
};

// Product descriptions
const productDescriptions = {
  "Laptop": "Powerful laptop with high-performance processor and long battery life. Perfect for work and entertainment on the go.",
  "Phone": "Latest smartphone with advanced camera system, stunning display, and all-day battery life. Stay connected in style.",
  "Headphones": "Premium noise-cancelling headphones with crystal clear sound quality and comfortable over-ear design.",
  "Shoes": "Comfortable and stylish shoes designed for all-day wear. Perfect for both casual outings and active lifestyles.",
  "Watch": "Elegant timepiece with modern design, water resistance, and multiple smart features to keep you on schedule.",
  "Backpack": "Durable backpack with multiple compartments, padded laptop sleeve, and ergonomic design for maximum comfort.",
  "Sunglasses": "UV-protected sunglasses with polarized lenses to reduce glare and protect your eyes in style.",
  "Camera": "High-resolution camera with advanced features for professional photography and videography.",
  "Tablet": "Portable tablet with high-definition display, powerful performance, and all-day battery life.",
 
};

// Initialize products
const initializeProducts = () => {
  const productList = [
    { name: "Laptop", price: 60000 },
    { name: "Phone", price: 20000 },
    { name: "Headphones", price: 8000 },
    { name: "Shoes", price: 2500 },
    { name: "Watch", price: 4000 },
    { name: "Backpack", price: 500 },
    { name: "Sunglasses", price: 2000 },
    { name: "Camera", price: 35000 },
    { name: "Tablet", price: 25000 }
  ];
  
  // Ensure all products have the required fields
  return productList.map(product => {
    // Normalize the product name to match image keys
    let imageKey = product.name;
    if (product.name === 'Sunglasses') {
      imageKey = 'Sunglasses';
    } else if (product.name === 'Smart Watch' || product.name === 'Smartwatch') {
      imageKey = 'Smart Watch';
    }
    
    const category = productCategories[product.name] || 'Uncategorized';
    const subcategory = productSubcategories[product.name] || 'General';
    const imageUrl = productImages[imageKey] || 'https://via.placeholder.com/300';
    const description = productDescriptions[product.name] || `A high-quality ${product.name}`;
    
    return {
      ...product,
      category,
      subcategory,
      imageUrl,
      description,
      id: `prod_${product.name.toLowerCase().replace(/\s+/g, '_')}`
    };
  });
};

// Initialize products
let products = initializeProducts();
console.log('Products initialized successfully');

// Debug: Log sunglasses product data
const sunglasses = products.find(p => p.name === 'Sunglasses');
if (sunglasses) {
  console.log('Sunglasses product data:', {
    name: sunglasses.name,
    imageUrl: sunglasses.imageUrl,
    id: sunglasses.id,
    category: sunglasses.category,
    subcategory: sunglasses.subcategory
  });
} else {
  console.log('Sunglasses product not found in products array');
}

// API Endpoints
app.get("/api/products", (req, res) => {
  try {
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Categories endpoint
app.get("/api/categories", (req, res) => {
  try {
    const categoriesData = {};
    const subcategoryCounts = {};
    
    // Build categories structure and count products
    products.forEach(product => {
      if (product.category) {
        // Initialize category if not exists
        if (!categoriesData[product.category]) {
          categoriesData[product.category] = {
            id: product.category.toLowerCase(),
            name: product.category,
            description: categories[product.category]?.description || `${product.category} products`,
            productCount: 0,
            available: true,
            subcategories: {}
          };
        }
        
        // Count products in category
        categoriesData[product.category].productCount++;
        
        // Handle subcategories
        if (product.subcategory) {
          const subKey = product.subcategory.toLowerCase();
          
          // Initialize subcategory if not exists
          if (!categoriesData[product.category].subcategories[subKey]) {
            categoriesData[product.category].subcategories[subKey] = {
              id: subKey,
              name: product.subcategory,
              productCount: 0,
              available: true
            };
          }
          
          // Count products in subcategory
          categoriesData[product.category].subcategories[subKey].productCount++;
          
          // Keep track of subcategory counts
          subcategoryCounts[subKey] = (subcategoryCounts[subKey] || 0) + 1;
        }
      }
    });
    
    // Convert to array format
    const categoriesArray = Object.values(categoriesData).map(category => ({
      ...category,
      subcategories: Object.values(category.subcategories)
    }));
    
    res.json(categoriesArray);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Checkout endpoint
app.post("/api/checkout", (req, res) => {
  try {
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart)) {
      return res.status(400).json({ message: 'Invalid cart data' });
    }
    
    console.log("New Order Received:", cart);
    res.json({ 
      success: true,
      message: "Order placed successfully!",
      orderId: `ORD-${Date.now()}`
    });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Checkout failed' });
  }
});

// Only start the server if this file is run directly (not when imported for testing)
let server;

// Helper function for conditional logging
const log = (...args) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(...args);
  }
};

// Function to start the server
const startServer = () => {
  if (process.env.NODE_ENV !== 'test') {
    const PORT = process.env.PORT || 5000;
    server = app.listen(PORT, '0.0.0.0', () => {
      log(`Server is running on port ${PORT}`);
      log(`API available at http://localhost:${PORT}/api`);
    });
  }
  return server;
};

// Start the server if this file is run directly
if (require.main === module) {
  startServer();
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

// Export the Express app for testing
module.exports = app;
