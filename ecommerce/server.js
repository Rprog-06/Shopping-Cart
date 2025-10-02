const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());
// Product categories mapping with more specific categories
const productCategories = {
  "Laptop": "Electronics",
  "Phone": "Electronics",
  "Headphones": "Electronics",
  "Tablet": "Electronics",
  "Camera": "Electronics",
  "Smart Watch": "Electronics",
  "Smartwatch": "Electronics",
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
  "Smart Watch": "Wearables",
  "Smartwatch": "Wearables",
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
  "Footwear": { name: "Footwear", parent: "Fashion" },
  "Accessories": { name: "Accessories", parent: "Fashion" },
  "Bags": { name: "Bags", parent: "Fashion" }
};

// Product-specific image URLs for better relevance
const productImages = {
  "Laptop": "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop",
  "Phone": "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
  "Headphones": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
  "Shoes": "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
  "Smart Watch": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
  "Backpack": "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
  "Sunglasses": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
  "Camera": "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&h=400&fit=crop",
  "Tablet": "https://images.unsplash.com/photo-1542751110-97427bbecf20?w=400&h=400&fit=crop",
  "Smartwatch": "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?w=400&h=400&fit=crop"
};

// Product descriptions
const productDescriptions = {
  "Laptop": "High-performance laptop perfect for work and entertainment. Features a stunning display, powerful processor, and long-lasting battery life for all-day productivity.",
  "Phone": "Latest smartphone with advanced camera system, fast processor, and all-day battery. Perfect for capturing memories and staying connected.",
  "Headphones": "Premium wireless headphones with noise cancellation and superior sound quality. Enjoy your music without distractions.",
  "Tablet": "Versatile tablet for work and play. Features a large, vibrant display and all-day battery life for productivity on the go.",
  "Camera": "Professional DSLR camera for photography enthusiasts. Capture stunning images with manual controls and interchangeable lenses.",
  "Smart Watch": "Advanced smartwatch with health monitoring, GPS tracking, and smartphone connectivity. Stay fit and connected.",
  "Smartwatch": "Feature-rich smartwatch with heart rate monitoring, activity tracking, and notification alerts. Your fitness companion.",
  "Shoes": "Comfortable athletic shoes designed for running and daily activities. Lightweight with superior cushioning and support.",
  "Sunglasses": "Stylish sunglasses with UV protection and polarized lenses. Perfect for outdoor activities and driving.",
  "Backpack": "Durable backpack with multiple compartments and ergonomic design. Perfect for daily commute and travel."
};

// Simplified approach - use hardcoded URLs for reliable images
async function getImage(query) {
  // This function is no longer needed but kept for compatibility
  return "https://picsum.photos/400/400?random=" + Math.floor(Math.random() * 1000);
}
 


async function validateImageUrl(url) {
  try {
    const https = require('https');
    return new Promise((resolve) => {
      const req = https.request(url, { method: 'HEAD' }, (res) => {
        resolve(res.statusCode >= 200 && res.statusCode < 400);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(5000, () => {
        resolve(false);
        req.destroy();
      });
      req.end();
    });
  } catch {
    return false;
  }
}
// GET endpoint - list products with categories
app.get("/api/products", async (req, res) => {
  // List of products - image URLs will be assigned from productImages mapping
  const productList = [
    { name: "Laptop", price: 60000 },
    { name: "Phone", price: 20000 },
    { name: "Headphones", price: 3000 },
    { name: "Shoes", price: 2500 },
    { name: "Smart Watch", price: 4000 },
    { name: "Backpack", price: 1500 },
    { name: "Sunglasses", price: 1200 },
    { name: "Camera", price: 35000 },
    { name: "Tablet", price: 25000 },
    { name: "Smartwatch", price: 8000 }
  ];

  try {
    // All products now have specific, relevant image URLs
    const productsWithImages = await Promise.all(
      productList.map(async (product, index) => {
        // Use the specific product image if available
        const specificImage = productImages[product.name];
        if (specificImage) {
          product.imageUrl = specificImage;
        }

        // Add category information
        product.category = productCategories[product.name] || "Uncategorized";
        product.subcategory = productSubcategories[product.name] || "General";
        product.description = productDescriptions[product.name] || "No description available.";

        // Validate the URL (though these should all work)
        if (product.imageUrl) {
          const isValid = await validateImageUrl(product.imageUrl);
          if (!isValid) {
            // Ultimate fallback to Picsum
            product.imageUrl = "https://picsum.photos/400/400?random=" + (index + 200);
          }
        }
        return { id: index + 1, ...product };
      })
    );

    res.json(productsWithImages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
});



// GET endpoint - list categories with product counts
app.get("/api/categories", async (req, res) => {
  try {
    // Get all products first to count by category
    const productList = [
      { name: "Laptop", price: 60000 },
      { name: "Phone", price: 20000 },
      { name: "Headphones", price: 3000 },
      { name: "Shoes", price: 2500 },
      { name: "Smart Watch", price: 4000 },
      { name: "Backpack", price: 1500 },
      { name: "Sunglasses", price: 1200 },
      { name: "Camera", price: 35000 },
      { name: "Tablet", price: 25000 },
      { name: "Smartwatch", price: 8000 }
    ];

    // Count products by category and subcategory
    const categoryCounts = {};
    const subcategoryCounts = {};
    productList.forEach(product => {
      const category = productCategories[product.name] || "Uncategorized";
      const subcategory = productSubcategories[product.name] || "General";

      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
      subcategoryCounts[subcategory] = (subcategoryCounts[subcategory] || 0) + 1;
    });

    // Build response with category info and counts
    const categoriesWithCounts = Object.keys(categories).map(categoryKey => {
      const category = categories[categoryKey];
      return {
        id: categoryKey,
        name: category.name,
        description: category.description,
        productCount: categoryCounts[categoryKey] || 0,
        available: (categoryCounts[categoryKey] || 0) > 0,
        subcategories: Object.keys(subcategories)
          .filter(subKey => subcategories[subKey].parent === categoryKey)
          .map(subKey => ({
            id: subKey,
            name: subcategories[subKey].name,
            productCount: subcategoryCounts[subKey] || 0,
            available: (subcategoryCounts[subKey] || 0) > 0
          }))
      };
    });

    res.json(categoriesWithCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

app.post("/api/checkout", (req, res) => {
  const { cart } = req.body;
  console.log("New Order Received:", cart);
  res.json({ message: "Order placed successfully!" });
});

const PORT = 5000;
// Only start the server if this file is run directly (not when imported for testing)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// Export the Express app for testing
module.exports = app;
