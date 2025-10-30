// frontend/lib/api.ts

const PRODUCT_API = "http://localhost:3002";   // Product service
const ORDER_API = "http://localhost:3002";     // ✅ Order service correct port
const CUSTOMER_API = "http://localhost:3001";  // Customer service

export async function fetchProducts() {
  const res = await fetch(`${PRODUCT_API}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function fetchCustomerOrders(customerId: number) {
  const res = await fetch(`${ORDER_API}/orders/customer/${customerId}`);
  if (!res.ok) throw new Error("Failed to fetch customer orders");
  return res.json();
}


export interface CreateOrderPayload {
  customerId: number;
  items: { productId: number; quantity: number; price: number }[];
  totalPrice: number;
}


export interface Order {
  id: number;
  customerId: number;
  totalPrice: number;
  items: { productId: number; quantity: number; price: number }[];
  status?: string;
}

export const createCustomer = async (payload: { name: string, email: string, address: string }) => {
const response = await fetch('/api/customers', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
});
if (!response.ok) throw new Error('Failed to create customer');
return response.json();
};

export async function createOrder(orderData: CreateOrderPayload): Promise<Order> {
  console.log("Sending orderData:", orderData);
  const res = await fetch(`${ORDER_API}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  // if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}
