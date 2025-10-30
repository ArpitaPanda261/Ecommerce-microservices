"use client";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../lib/api";

export default function CartPage() {
  const { items, clearCart, total } = useCart();

  const handleCheckout = async () => {
    const orderData = {
      customerId: 1, // hardcoded temporarily
      items: items.map((item) => ({
        productId: Number(item.product.id),   // ✅ match DTO
        quantity: Number(item.quantity),
        price: Number(item.product.price),
      })),
      totalPrice: Number(total),
    };

    console.log("✅ Sending orderData:", orderData);

    try {
      const response = await createOrder(orderData);
      console.log("✅ Order created:", response);
      alert("Order placed successfully!");
      clearCart();
    } catch (err) {
      console.error("❌ Order creation failed:", err);
      alert("Failed to place order");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p>No items in cart</p>
      ) : (
        <>
          <ul className="divide-y divide-gray-200 mb-4">
            {items.map((item) => (
              <li key={item.product.id} className="py-2 flex justify-between">
                <span>
                  {item.product.name} × {item.quantity}
                </span>
                <span>₹{item.product.price * item.quantity}</span>
              </li>
            ))}
          </ul>
          <h3 className="font-semibold mb-2">Total: ₹{total}</h3>
          <button
            onClick={handleCheckout}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-500"
          >
            Checkout
          </button>
        </>
      )}
    </div>
  );
}
