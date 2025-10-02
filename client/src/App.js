import { useState, useEffect, useCallback, useMemo } from "react";
import { ShoppingCart, Search, X } from "lucide-react";
import { FiFilter } from "react-icons/fi";
import ProductCard from "./components/ProductCard";
import CartDrawer from "./components/CartDrawer";
import ProductDetailsModal from "./components/ProductDetailsModal";
import Toast from "./components/Toast";

const productsUrl = "http://localhost:5000/api/products";
const categoriesUrl = "http://localhost:5000/api/categories";
const App = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // Initialize cart from localStorage
  const [cart, setCart] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('shoppingCart');
      return savedCart ? JSON.parse(savedCart) : [];
    }
    return [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false); // Set cart to be open by default
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [isCategoryOpen, setIsCategoryOpen] = useState(true);
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  // State for price range filter
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("featured");
  
  // Get subcategories for the selected category
  const currentSubcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    
    // Find the category by name (case insensitive)
    const category = Array.isArray(categories) 
      ? categories.find(cat => 
          cat.name && cat.name.toLowerCase() === selectedCategory.toLowerCase()
        ) 
      : null;
      
    // If no category found, try to find in the products
    if (!category) {
      const productWithCategory = products.find(p => 
        p.category && p.category.toLowerCase() === selectedCategory.toLowerCase()
      );
      if (productWithCategory) {
        // If we found a product with this category, return its subcategories if any
        return productWithCategory.subcategory 
          ? [{ id: productWithCategory.subcategory, name: productWithCategory.subcategory }] 
          : [];
      }
      return [];
    }
    
    return category.subcategories || [];
  }, [categories, selectedCategory]);

  // Sort products based on selected sort option
  const sortedAndFilteredProducts = useMemo(() => {
    // First filter the products
    let result = [...products].filter(product => {
      // Debug logs - can be removed after fixing
      console.log('Product:', product.name, 'Category:', product.category, 'Subcategory:', product.subcategory);
      console.log('Selected Category:', selectedCategory, 'Selected Subcategory:', selectedSubcategory);
      
      // Search term filter - only match exact product names
      const searchLower = searchTerm.toLowerCase().trim();
      const matchesSearch = searchTerm === "" || 
        product.name.toLowerCase() === searchLower ||
        // Only include partial matches if the search term is longer than 3 characters
        (searchLower.length >= 3 && 
         product.name.toLowerCase().includes(searchLower));
      
      // Category filter - check if product's category matches selected category
      const matchesCategory = selectedCategory === "all" || 
        (product.category && product.category.toLowerCase() === selectedCategory.toLowerCase());
      
      // Subcategory filter - only apply if a subcategory is selected
      let matchesSubcategory = true;
      if (selectedSubcategory !== "all") {
        matchesSubcategory = product.subcategory && 
          product.subcategory.toLowerCase() === selectedSubcategory.toLowerCase();
      }
      
      // Price range filter with better handling of ranges
      let matchesPrice = true;
      if (priceRange) {
        try {
          const [minStr, maxStr] = priceRange.split('-');
          const min = minStr ? parseInt(minStr, 10) : null;
          const max = maxStr ? parseInt(maxStr, 10) : null;
          
          if (min !== null && max !== null) {
            // Range with both min and max (e.g., 5000-10000)
            matchesPrice = product.price >= min && product.price <= max;
          } else if (min !== null) {
            // Only min specified (e.g., 10000-)
            matchesPrice = product.price >= min;
          } else if (max !== null) {
            // Only max specified (e.g., -5000)
            matchesPrice = product.price <= max;
          }
          
          console.log(`Price check - Product: ${product.name}, Price: ${product.price}, Range: ${priceRange}, Matches: ${matchesPrice}`);
        } catch (error) {
          console.error('Error processing price range:', error);
        }
      }
      
      // Debug log the matching results
      console.log(`Product: ${product.name} - Matches:`, {
        search: matchesSearch,
        category: matchesCategory,
        subcategory: matchesSubcategory,
        price: matchesPrice
      });
      
      return matchesSearch && matchesCategory && matchesSubcategory && matchesPrice;
    });

    // Then sort the filtered products
    switch(sortBy) {
      case 'price-asc':
        return [...result].sort((a, b) => a.price - b.price);
      case 'price-desc':
        return [...result].sort((a, b) => b.price - a.price);
      case 'name-asc':
        return [...result].sort((a, b) => a.name.localeCompare(b.name));
      case 'name-desc':
        return [...result].sort((a, b) => b.name.localeCompare(a.name));
      case 'featured':
      default:
        return result;
    }
  }, [products, searchTerm, selectedCategory, selectedSubcategory, priceRange, sortBy]);
  
  // View product details
  const viewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  // Close product modal
  const closeProductModal = () => {
    setShowProductModal(false);
    // Small delay to allow the modal to close before clearing the product
    // This prevents any flicker in the UI
    setTimeout(() => setSelectedProduct(null), 300);
  };

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [productsRes, categoriesRes] = await Promise.all([
        fetch(productsUrl),
        fetch(categoriesUrl)
      ]);

      if (!productsRes.ok) throw new Error('Failed to fetch products');
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');

      const [productsData, categoriesData] = await Promise.all([
        productsRes.json(),
        categoriesRes.json()
      ]);

      setProducts(productsData);
      setCategories(categoriesData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || 'An error occurred while fetching data');
      setToast({
        show: true,
        message: 'Failed to load products. Please try again later.',
        type: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
  }, []);

  const hasActiveFilters = searchTerm || selectedCategory !== "all" || selectedSubcategory !== "all";

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
  }, [cart]);

  //  Add to Cart Function
  const addToCart = (product) => {
    setCart((prevCart) => {
      const itemExists = prevCart.find((item) => item.id === product.id);
      if (itemExists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    setToast({
      show: true,
      message: `${product.name} added to cart!`,
      type: "success"
    });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 2000);
  };

  //  Remove from Cart Function
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  //  Update Quantity
  const updateQuantity = (id, quantity) => {
    if (quantity < 1) {
      // Remove the item if quantity reaches zero
      removeFromCart(id);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    }
  };

  // Handle order placement
  const placeOrder = () => {
    // In a real app, you would send the order to your backend here
    console.log('Placing order:', cart);
    
    // Show success message
    setToast({
      show: true,
      message: 'Order placed successfully!',
      type: 'success'
    });
    
    // Clear the cart
    setCart([]);
    
    // Close the cart drawer
    setIsCartOpen(false);
  };

  // Group products by category for the sidebar
  const categoriesWithCount = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {});

  const uniqueCategories = Object.keys(categoriesWithCount);

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-indigo-600">ShopEase</h1>
              <button
                onClick={() => setIsCartOpen(true)}
                className="md:hidden relative p-2 text-gray-600 hover:text-gray-900"
              >
                <ShoppingCart className="h-6 w-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>
            
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-shadow"
              />
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              ) : (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <kbd className="inline-flex items-center px-2 py-1 border border-gray-200 rounded text-xs font-sans font-medium text-gray-400">
                    ⌘K
                  </kbd>
                </div>
              )}
            </div>
            
            <button
              onClick={() => setIsCartOpen(true)}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
              {cart.length > 0 && (
                <span className="bg-white text-indigo-600 text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
          </div>
          
          {searchTerm && (
            <div className="mt-3 text-sm text-gray-500">
              <span>Search results for: </span>
              <span className="font-medium">"{searchTerm}"</span>
              <button 
                onClick={() => setSearchTerm("")}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </header>
      
      {/* Subcategories Bar */}
      {selectedCategory !== "all" && currentSubcategories.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto py-2 space-x-2">
              <button
                onClick={() => setSelectedSubcategory("all")}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${
                  selectedSubcategory === "all"
                    ? 'bg-indigo-100 text-indigo-800'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                All
              </button>
              {currentSubcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => setSelectedSubcategory(subcategory.id)}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium ${
                    selectedSubcategory === subcategory.id
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {subcategory.name}
                  <span className="ml-1.5 text-xs font-normal bg-gray-100 text-gray-500 rounded-full px-2 py-0.5">
                    {subcategory.productCount || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Categories Sidebar - Hidden on mobile when subcategories are shown */}
          <div className={`${selectedCategory !== "all" && currentSubcategories.length > 0 ? 'hidden lg:block' : ''} w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FiFilter className="mr-2 h-5 w-5 text-indigo-500" />
                  Categories
                </h2>
                {(selectedCategory !== "all" || selectedSubcategory !== "all") && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline"
                  >
                    Reset
                  </button>
                )}
              </div>
              
              <div className="space-y-1">
                <div 
                  className={`flex items-center px-3 py-2.5 rounded-lg cursor-pointer ${
                    selectedCategory === "all" ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedSubcategory("all");
                  }}
                >
                  <span className="text-sm font-medium">All Categories</span>
                  <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {products.length}
                  </span>
                </div>
                
                {uniqueCategories.map((category) => (
                  <div key={category} className="pl-3">
                    <div 
                      className={`flex items-center px-3 py-2 -ml-3 rounded-lg cursor-pointer ${
                        selectedCategory === category ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setSelectedSubcategory("all");
                      }}
                    >
                      <span className="text-sm">{category}</span>
                      <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                        {categoriesWithCount[category]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Price Filter */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Price Range</h3>
                <div className="space-y-2">
                  {[
                    { label: 'All Prices', value: '' },
                    { label: 'Under ₹1,000', value: '0-1000' },
                    { label: '₹1,000 - ₹5,000', value: '1000-5000' },
                    { label: '₹5,000 - ₹10,000', value: '5000-10000' },
                    { label: 'Over ₹10,000', value: '10000-' },
                  ].map((range) => (
                    <div key={range.value} className="flex items-center">
                      <input
                        id={`price-${range.value}`}
                        name="price-range"
                        type="radio"
                        checked={priceRange === range.value}
                        onChange={() => setPriceRange(range.value)}
                        className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label htmlFor={`price-${range.value}`} className="ml-3 text-sm text-gray-600 cursor-pointer">
                        {range.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Subcategories */}
              {currentSubcategories.length > 0 && (
                <div className="mt-6 pt-5 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Subcategories</h3>
                  <div className="space-y-2 pl-2">
                    <div 
                      className={`flex items-center px-3 py-2 -ml-3 rounded-lg cursor-pointer ${
                        selectedSubcategory === "all" ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedSubcategory("all")}
                    >
                      <span className="text-sm">All Subcategories</span>
                    </div>
                    {currentSubcategories.map((subcategory) => (
                      <div 
                        key={subcategory.id} 
                        className={`flex items-center px-3 py-2 rounded-lg cursor-pointer ${
                          selectedSubcategory === subcategory.id ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedSubcategory(subcategory.id)}
                      >
                        <span className="text-sm">{subcategory.name}</span>
                        <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          {subcategory.productCount || 0}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedCategory === "all" ? "All Products" : selectedCategory}
                <span className="text-gray-500 font-normal ml-2">
                  ({sortedAndFilteredProducts.length} {sortedAndFilteredProducts.length === 1 ? 'item' : 'items'})
                </span>
              </h2>
              
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span>Sort by:</span>
                <select 
                  className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-300"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A to Z</option>
                  <option value="name-desc">Name: Z to A</option>
                 
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 animate-pulse">
                    <div className="bg-gray-200 h-48 w-full"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-10 bg-gray-200 rounded-lg"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedAndFilteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
                <div className="mx-auto h-24 w-24 text-gray-300 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
                <p className="text-gray-500 mb-6">
                  {searchTerm 
                    ? `No products match "${searchTerm}"`
                    : 'Try adjusting your search or filter to find what you\'re looking for.'}
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedAndFilteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    addToCart={addToCart}
                    openModal={() => viewProduct(product)}
                  />
                ))}
              </div>
            )}
            
            {/* Removed Load more button */}
          </div>
        </div>
      </main>

      {/* Product Details Modal */}
      {selectedProduct && (
        <ProductDetailsModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          addToCart={addToCart} // passed here too
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)} 
        cart={cart}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        onPlaceOrder={placeOrder}
      />

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(prev => ({ ...prev, show: false }))}
        />
      )}
    </div>
  );
}

export default App;
