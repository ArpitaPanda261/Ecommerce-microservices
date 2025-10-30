// components/ProductCard.tsx
"use client";
import { Product } from "../types";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  return (
    <div className="border rounded-md p-4 shadow-sm bg-white">
      <h3 className="font-semibold">{product.name}</h3>
      <p className="text-sm text-gray-600">{product.description ?? ""}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-lg font-medium">₹{Number(product.price).toFixed(2)}</div>
        <button onClick={() => addToCart(product)} className="bg-indigo-600 text-white px-3 py-1 rounded">
          Add
        </button>
      </div>
    </div>
  );
}
