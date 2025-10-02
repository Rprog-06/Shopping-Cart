import React from 'react';
import { X } from 'lucide-react';

const ProductDetailsModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-48 w-48 rounded-md bg-gray-100 sm:mx-0 sm:h-64 sm:w-64">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
            
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                {product.name}
              </h3>
              
              <div className="mt-1">
                <p className="text-2xl font-bold text-indigo-600">
                  {new Intl.NumberFormat('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    maximumFractionDigits: 0
                  }).format(product.price)}
                </p>
                
                {product.category && (
                  <p className="mt-2 text-sm text-gray-500">
                    <span className="font-medium">Category:</span> {product.category}
                  </p>
                )}
                
                {product.subcategory && product.subcategory !== 'General' && (
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">Type:</span> {product.subcategory}
                  </p>
                )}
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {product.description || 'No description available.'}
                </p>
              </div>
              
              <div className="mt-5 sm:mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;
