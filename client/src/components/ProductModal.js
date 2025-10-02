// components/ProductModal.js
import { X } from "lucide-react";

export default function ProductModal({ product, onClose, onAddToCart }) {
  if (!product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500"
        >
          <X size={20} />
        </button>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-56 object-cover rounded-lg"
        />
        <h2 className="text-xl font-semibold mt-4">{product.name}</h2>
        <p className="text-gray-600 mt-2">Price: ₹{product.price}</p>
        <button
          onClick={() => {
            onAddToCart(product);
            onClose();
          }}
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
