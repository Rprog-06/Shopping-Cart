import React, { useState, useEffect } from "react";
import axios from "axios";

function cart() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error(err));
  }, []);

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const checkout = () => {
    axios.post("http://localhost:5000/api/checkout", { cart })
      .then(res => {
        alert(res.data.message);
        setCart([]);
        setShowCart(false);
      })
      .catch(err => console.error(err));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Mini E-Commerce</h1>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={() => setShowCart(!showCart)}
      >
        Cart ({cart.length})
      </button>

      {showCart ? (
        <div className="border p-4 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Cart</h2>
          {cart.length === 0 ? (
            <p>No items in cart</p>
          ) : (
            <>
              <ul>
                {cart.map(item => (
                  <li key={item.id} className="mb-2">
                    {item.name} x {item.quantity} = ₹{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              <p className="font-bold">Total: ₹{total}</p>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
                onClick={checkout}
              >
                Checkout
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className="border rounded p-2 text-center">
              <img src={p.imageUrl} alt={p.name} className="w-full h-32 object-cover mb-2"/>
              <h2 className="font-medium">{p.name}</h2>
              <p>₹{p.price}</p>
              <button
                className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
                onClick={() => addToCart(p)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default cart;
