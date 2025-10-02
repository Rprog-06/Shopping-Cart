// src/components/ProductCard.js
import React, { useState, useRef, useEffect } from "react";
import { FiShoppingCart, FiLoader, FiImage, FiInfo, FiX } from "react-icons/fi";

const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
};

export default function ProductCard({ product, addToCart, viewProduct }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDescription, setShowDescription] = useState(false);
  const descriptionRef = useRef(null);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const toggleDescription = (e) => {
    e.stopPropagation();
    setShowDescription(!showDescription);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full">
      <div className="relative bg-gray-50 h-48 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <FiLoader className="animate-spin text-gray-300 h-8 w-8" />
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            <FiImage className="h-12 w-12" />
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        )}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <div 
          className="cursor-pointer" 
          onClick={() => viewProduct && viewProduct(product)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && viewProduct && viewProduct(product)}
        >
          <h3 className="font-medium text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
          <div className="flex justify-between items-center mb-3">
            <p className="text-indigo-600 font-semibold">{formatPrice(product.price)}</p>
            <button 
              onClick={toggleDescription}
              className="text-xs text-indigo-500 hover:text-indigo-700 font-medium flex items-center"
            >
              <FiInfo className="mr-1 h-3 w-3" />
              {showDescription ? 'Hide Details' : 'View Details'}
            </button>
          </div>
          {showDescription && (
            <div 
              ref={descriptionRef}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDescription(false);
                  }}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <FiX className="h-5 w-5" />
                </button>
                <h3 className="text-lg font-semibold mb-4">{product.name} Details</h3>
                <div className="space-y-4">
                  {product.imageUrl && (
                    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img 
                        src={product.imageUrl} 
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MDAiIGhlaWdodD0iNjAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2QxZDVkYyIgc3Ryb2tlLXdpZHRoPSIyIj48cmVjdCB3aWR0aD0iMjQiIGhlaWdodD0iMjAiIHg9IjAiIHk9IjIiIHJ4PSIyIi8+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiLz48cGF0aCBkPSJNMjEgMTVhMiAyIDAgMCAxLTIgMkg1bDQtNGMuNjEtLjYxIDIuMTQtMS4xIDMuNS0uNSAxLjguOCAxLjUgMi41IDEuNSAzLjV6Ii8+PC9zdmc+';
                        }}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700">{product.description || 'No description available.'}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <FiInfo className="mr-1" />
                      <span>Category: {product.category || 'N/A'}</span>
                    </div>
                    {product.subcategory && (
                      <div className="flex items-center text-sm text-gray-500">
                        <FiInfo className="mr-1" />
                        <span>Type: {product.subcategory}</span>
                      </div>
                    )}
                  </div>
                  <div className="pt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                        setShowDescription(false);
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiShoppingCart className="mr-2 h-4 w-4" />
                      Add to Cart - {formatPrice(product.price)}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-auto">
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <FiShoppingCart className="h-4 w-4" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
}
