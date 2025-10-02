// src/components/ProductGrid.js
import React from "react";
import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading, addToCart, viewProduct }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4 bg-white animate-pulse h-64"></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-1">No products found</h3>
        <p className="text-gray-500">Check back later for new products</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} addToCart={addToCart} viewProduct={viewProduct} />
      ))}
    </div>
  );
}
