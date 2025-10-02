import React, { useEffect, useState } from "react";
import axios from "axios";

// API base (change via env var if needed)
const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

const currency = (value) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);

export default function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [toast, setToast] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // load cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setCart(JSON.parse(saved));
    } catch (e) {
      console.error("Failed to read cart from localStorage", e);
    }
  }, []);

  // persist cart
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }, [cart]);

  // fetch products and categories
  useEffect(() => {
    let mounted = true;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch both products and categories in parallel
        const [productsRes, categoriesRes] = await Promise.all([
          axios.get(`${API_BASE}/api/products`),
          axios.get(`${API_BASE}/api/categories`)
        ]);

        if (mounted) {
          setProducts(productsRes.data || []);
          setCategories(categoriesRes.data || []);
          console.log("Categories loaded:", categoriesRes.data);
          console.log("Products loaded:", productsRes.data?.map(p => `${p.name}: ${p.category} -> ${p.subcategory}`));
        }
      } catch (err) {
        console.error(err);
        showToast("Failed to load data");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => (mounted = false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2400);
  };

  const addToCart = (product) => {
    setCart((prev) => {
      const found = prev.find((p) => p.id === product.id);
      if (found) return prev.map((p) => (p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
      return [...prev, { ...product, quantity: 1 }];
    });
    showToast(`${product.name} added to cart`);
  };

  const updateQuantity = (id, qty) => {
    setCart((prev) => {
      if (qty < 1) return prev.filter((p) => p.id !== id);
      return prev.map((p) => (p.id === id ? { ...p, quantity: qty } : p));
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p.id !== id));
    showToast("Item removed from cart");
  };

  const itemsCount = cart.reduce((s, i) => s + (i.quantity || 0), 0);
  const total = cart.reduce((s, i) => s + (i.quantity || 0) * (i.price || 0), 0);

  // Filter products based on search term, category, and subcategory
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Handle category and subcategory filtering
    let matchesFilter = true;
    if (selectedCategory !== "all" || selectedSubcategory !== "all") {
      if (selectedSubcategory !== "all") {
        // If a subcategory is selected, filter by subcategory
        matchesFilter = product.subcategory === selectedSubcategory;
        console.log(`Filtering by subcategory ${selectedSubcategory}, product ${product.name} has subcategory ${product.subcategory}, match: ${matchesFilter}`);
      } else if (selectedCategory !== "all") {
        // If only a category is selected, filter by category
        matchesFilter = product.category === selectedCategory;
        console.log(`Filtering by category ${selectedCategory}, product ${product.name} has category ${product.category}, match: ${matchesFilter}`);
      }
    }

    const result = matchesSearch && matchesFilter;
    if (!result && (searchTerm || selectedCategory !== "all" || selectedSubcategory !== "all")) {
      console.log(`Filtered out: ${product.name} - search: ${matchesSearch}, filter: ${matchesFilter}`);
    }
    return result;
  });

  const viewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSelectedProduct(null);
  };

  const checkout = async () => {
    if (cart.length === 0) {
      showToast("Cart is empty");
      return;
    }
    try {
      const res = await axios.post(`${API_BASE}/api/checkout`, { cart });
      showToast(res.data?.message || "Order placed");
      setCart([]);
      setShowCart(false);
    } catch (err) {
      console.error(err);
      showToast("Checkout failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white rounded-lg flex items-center justify-center font-semibold">E</div>
            <h1 className="text-xl font-semibold">Mini Shop</h1>
            <div className="hidden md:block ml-6">
              <input
                type="search"
                placeholder="Search products..."
                className="border rounded-md px-3 py-1 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Categories Dropdown */}
            <div className="hidden md:block relative">
              <select
                value={selectedSubcategory !== "all" ? selectedSubcategory : selectedCategory}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "all") {
                    setSelectedCategory("all");
                    setSelectedSubcategory("all");
                  } else {
                    // Check if it's a subcategory (by looking for it in any category's subcategories)
                    let foundSubcategory = null;
                    for (const category of categories) {
                      if (category.subcategories?.find(s => s.id === value)) {
                        foundSubcategory = category.subcategories.find(s => s.id === value);
                        break;
                      }
                    }

                    console.log("Selected value:", value, "Found subcategory:", foundSubcategory);

                    if (foundSubcategory) {
                      // It's a subcategory
                      setSelectedSubcategory(value);
                      setSelectedCategory(foundSubcategory.parent || "all");
                      console.log("Set subcategory:", value, "parent:", foundSubcategory.parent);
                    } else {
                      // It's a main category
                      setSelectedCategory(value);
                      setSelectedSubcategory("all");
                      console.log("Set category:", value);
                    }
                  }
                }}
                className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              >
                <option value="all">All Categories ({products.length})</option>
                {categories.map((category) => (
                  <optgroup key={category.id} label={`${category.name} (${category.productCount})`}>
                    <option value={category.id}>
                      {category.name} ({category.productCount})
                      {!category.available && " - Not Available"}
                    </option>
                    {category.subcategories?.map((subcategory) => (
                      <option key={subcategory.id} value={subcategory.id}>
                        &nbsp;&nbsp;{subcategory.name} ({subcategory.productCount})
                        {!subcategory.available && " - Not Available"}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            <button
              onClick={() => setShowCart(true)}
              aria-label="Open cart"
              className="relative inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md"
            >
              Cart
              <span className="ml-2 inline-block bg-white text-indigo-600 rounded-full text-xs w-6 h-6 flex items-center justify-center font-medium">{itemsCount}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Filter Status */}
        {!loading && (searchTerm || selectedCategory !== "all") && (
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {searchTerm && selectedCategory !== "all" && selectedSubcategory !== "all" ? (
                  <>Showing {filteredProducts.length} products for "<span className="font-medium">{searchTerm}</span>" in <span className="font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span> → <span className="font-medium">{categories.find(c => c.subcategories?.find(s => s.id === selectedSubcategory))?.subcategories?.find(s => s.id === selectedSubcategory)?.name}</span></>
                ) : searchTerm && selectedCategory !== "all" ? (
                  <>Showing {filteredProducts.length} products for "<span className="font-medium">{searchTerm}</span>" in <span className="font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span></>
                ) : searchTerm && selectedSubcategory !== "all" ? (
                  <>Showing {filteredProducts.length} products for "<span className="font-medium">{searchTerm}</span>" in <span className="font-medium">{categories.find(c => c.subcategories?.find(s => s.id === selectedSubcategory))?.subcategories?.find(s => s.id === selectedSubcategory)?.name}</span></>
                ) : searchTerm ? (
                  <>Showing {filteredProducts.length} products for "<span className="font-medium">{searchTerm}</span>"</>
                ) : selectedCategory !== "all" && selectedSubcategory !== "all" ? (
                  <>Showing {filteredProducts.length} products in <span className="font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span> → <span className="font-medium">{categories.find(c => c.subcategories?.find(s => s.id === selectedSubcategory))?.subcategories?.find(s => s.id === selectedSubcategory)?.name}</span></>
                ) : selectedCategory !== "all" ? (
                  <>Showing {filteredProducts.length} products in <span className="font-medium">{categories.find(c => c.id === selectedCategory)?.name}</span></>
                ) : selectedSubcategory !== "all" ? (
                  <>Showing {filteredProducts.length} products in <span className="font-medium">{categories.find(c => c.subcategories?.find(s => s.id === selectedSubcategory))?.subcategories?.find(s => s.id === selectedSubcategory)?.name}</span></>
                ) : (
                  <>Showing all {filteredProducts.length} products</>
                )}
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setSelectedSubcategory("all");
                }}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                Clear filters
              </button>
            </div>
          </div>
        )}

        <section>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4 bg-white animate-pulse h-64"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <div key={p.id} className="bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition transform hover:-translate-y-1">
                    <img src={p.imageUrl} alt={p.name} className="w-full h-40 object-cover" />
                    <div className="p-4">
                      <h3 className="font-medium text-sm">{p.name}</h3>
                      <p className="mt-2 font-semibold">{currency(p.price)}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <button className="px-3 py-1 bg-indigo-600 text-white rounded-md text-sm" onClick={() => addToCart(p)}>
                          Add to cart
                        </button>
                        <button className="text-sm text-gray-500 hover:text-indigo-600" onClick={() => viewProduct(p)}>
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {searchTerm || selectedCategory !== "all" || selectedSubcategory !== "all" ? "No products match your filters" : "No products found"}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm || selectedCategory !== "all" || selectedSubcategory !== "all"
                      ? "Try adjusting your search or category filters"
                      : "Check back later for new products"}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>

      {/* Cart Drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-lg transform transition-transform ${
          showCart ? "translate-x-0" : "translate-x-full"
        } z-50`}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Cart ({itemsCount})</h2>
          <button onClick={() => setShowCart(false)} aria-label="Close cart" className="text-gray-500 px-2 py-1 rounded hover:bg-gray-100">
            Close
          </button>
        </div>
        <div className="p-4 h-[70vh] overflow-auto">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <p className="mb-2">Your cart is empty</p>
              <p className="text-sm">Add products to see them here.</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li key={item.id} className="flex items-center space-x-3">
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{item.name}</h4>
                      <button onClick={() => removeFromCart(item.id)} className="text-sm text-red-500">
                        Remove
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center border rounded">
                        <button className="px-2" onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Decrease">-</button>
                        <div className="px-3">{item.quantity}</div>
                        <button className="px-2" onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Increase">+</button>
                      </div>
                      <div className="font-semibold">{currency(item.price * item.quantity)}</div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="p-4 border-t">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-gray-600">Subtotal</div>
            <div className="font-semibold">{currency(total)}</div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setCart([]);
                showToast("Cart cleared");
              }}
              className="flex-1 border rounded-md px-3 py-2"
            >
              Clear
            </button>
            <button onClick={checkout} className="flex-1 bg-indigo-600 text-white rounded-md px-3 py-2">
              Checkout
            </button>
          </div>
        </div>
      </div>

      {/* Product Details Modal */}
      {showProductModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h2>
                <button
                  onClick={closeProductModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                <div>
                  <div className="mb-4">
                    <span className="inline-block bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full mb-2">
                      {selectedProduct.category} → {selectedProduct.subcategory}
                    </span>
                    <p className="text-3xl font-bold text-gray-900">{currency(selectedProduct.price)}</p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      className="w-full bg-indigo-600 text-white py-3 px-6 rounded-md font-medium hover:bg-indigo-700 transition"
                      onClick={() => {
                        addToCart(selectedProduct);
                        closeProductModal();
                      }}
                    >
                      Add to Cart - {currency(selectedProduct.price)}
                    </button>
                    <button
                      className="w-full border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium hover:bg-gray-50 transition"
                      onClick={closeProductModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-4 py-2 rounded shadow">
          {toast}
        </div>
      )}
    </div>
  );
}
