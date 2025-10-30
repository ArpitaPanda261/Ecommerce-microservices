// types/index.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
};

export type CartItem = {
  product: Product;
  quantity: number; // ✅ match CartContext
};

export type Order = {
  id: number;
  customerId: number;
  totalPrice: number | string;
  items: Array<{
    id?: number;
    productId: number;
    price: number | string;
    quantity: number;
  }>;
};
