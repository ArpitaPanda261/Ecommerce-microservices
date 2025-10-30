// app/page.tsx
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to StoreFront</h1>
      <p className="mb-6 text-gray-600">Simple e-commerce frontend for your microservices project.</p>
      <div className="flex gap-4">
        <Link href="/products" className="px-6 py-2 bg-indigo-600 text-white rounded">View Products</Link>
        <Link href="/orders" className="px-6 py-2 border rounded">My Orders</Link>
      </div>
    </div>
  );
}
