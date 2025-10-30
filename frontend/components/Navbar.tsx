// components/Navbar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();

  const link = (href: string, label: string) => (
    <Link href={href} className={pathname === href ? "font-semibold text-indigo-600" : "text-gray-600"}>
      {label}
    </Link>
  );

  return (
    <header className="bg-white shadow-sm sticky top-0 z-30">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/products" className="text-xl font-bold flex items-center gap-2">
          <svg className="w-7 h-7 text-indigo-600" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
          StoreFront
        </Link>

        <nav className="flex items-center gap-6">
          {link("/products", "Products")}
          {link("/orders", "My Orders")}
          <Link href="/cart" className="relative">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17"/></svg>
            {cartCount > 0 && <span className="absolute -top-2 -right-3 bg-red-600 text-white text-xs rounded-full px-1">{cartCount}</span>}
          </Link>
        </nav>
      </div>
    </header>
  );
}
