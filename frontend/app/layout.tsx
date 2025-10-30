"use client";

import "./globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";
import { CartProvider } from "../context/CartContext";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-light">
        <CartProvider>
          <Navbar />
          <main className="container my-5">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
