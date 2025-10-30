"use client";
import { useEffect, useState } from "react";
import { fetchProducts } from "../../lib/api";
import { useCart } from "../../context/CartContext";
import { Product } from "../../types"; // ✅ import from shared type

export default function ProductsPage() {
  const { addToCart } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <p className="text-gray-600">₹{product.price}</p>
          <button
            className="bg-indigo-600 text-white mt-3 px-4 py-2 rounded hover:bg-indigo-500"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}
