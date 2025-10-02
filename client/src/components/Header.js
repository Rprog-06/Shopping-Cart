// src/components/Header.js
import React from "react";

export default function Header({ searchTerm, setSearchTerm, itemsCount, setShowCart }) {
  return (
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
          <button
            onClick={() => setShowCart(true)}
            aria-label="Open cart"
            className="relative inline-flex items-center px-3 py-2 bg-indigo-600 text-white rounded-md"
          >
            Cart
            <span className="ml-2 inline-block bg-white text-indigo-600 rounded-full text-xs w-6 h-6 flex items-center justify-center font-medium">
              {itemsCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
