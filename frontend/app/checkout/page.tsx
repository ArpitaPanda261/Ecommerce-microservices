// app/checkout/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { createCustomer, createOrder } from "../../lib/api";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!name || !email || !address) return setErr("Please fill all fields");
    if (items.length === 0) return setErr("Cart is empty");

    setLoading(true);
    try {
      // 1) create customer (server should create or return existing)
      const customer = await createCustomer({ name, email, address });
      // 2) create order on Product/Order service
      const payload = {
        customerId: customer.id,
        totalPrice: Number(total),
        items: items.map((it) => ({
          productId: it.product.id,
          price: Number(it.product.price),
          quantity: it.quantity
        })),
      };
      await createOrder(payload);
      clearCart();
      // redirect to orders with customerId in query (orders page reads it)
      router.push(`/orders?customerId=${customer.id}`);
    } catch (error) {
      setErr(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm">Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm">Address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border px-3 py-2 rounded" />
        </div>

        {err && <div className="text-red-600">{err}</div>}

        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600">Total</div>
            <div className="text-xl font-semibold">₹{total.toFixed(2)}</div>
          </div>
          <button disabled={loading} type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded">
            {loading ? "Processing..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
