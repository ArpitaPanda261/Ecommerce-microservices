# 🛍️ E-Commerce Microservices System

## 📘 Overview
This project is a **microservices-based e-commerce system** built using **NestJS**, **PostgreSQL**, **RabbitMQ**, and a **Next.js frontend**.  
It demonstrates modular architecture, inter-service communication, and end-to-end functionality — from browsing products to placing and viewing customer orders.

---

## ⚙️ Architecture Overview

### 🧩 System Components

| **Customer Service** | Manages customers (creation, retrieval, and their associated orders). | NestJS, TypeORM, PostgreSQL | `3001` |
| **Product & Order Service** | Handles product catalog, order creation, and order items. Publishes order events via RabbitMQ. | NestJS, TypeORM, RabbitMQ, PostgreSQL | `3002` |
| **Frontend** | Next.js app allowing users to browse products, add to cart, checkout, and view their orders. | Next.js (React + TypeScript) | `3000` |
| **RabbitMQ** | Message broker for asynchronous communication between microservices. | RabbitMQ | `5672` |

---

## 🧱 Microservice Communication (RabbitMQ)

- The **Order Service** emits an event `order_created` whenever a new order is successfully created.
- The **Customer Service** listens for this event to associate the order with the corresponding customer and store the reference in its own database.
- This design ensures **loose coupling** and **data consistency** between microservices.

Database Schema
Customer Service

Customer (id, name, email, address)

Order (id, customerId, totalPrice, createdAt, status)

Product/Order Service

Product (id, name, price, stock)

Order (id, customerId, totalPrice, createdAt, status)

OrderItem (id, orderId, productId, quantity, price)

🚀 Setup & Installation
1️⃣ Prerequisites

Node.js (>=18)

PostgreSQL (running locally or on Docker)

RabbitMQ (locally or via Docker)

pnpm / npm / yarn

2️⃣ Clone the Repository
git clone https://github.com/arpitapanda261/ecommerce-microservices.git
cd ecommerce-microservices

3️⃣ Environment Variables

Create .env files for each service.

🧩 customer-service/.env
PORT=3001
DATABASE_URL=postgres://postgres:password@localhost:5432/customerdb
RABBITMQ_URL=amqp://localhost

🧩 order-service/.env
PORT=3002
DATABASE_URL=postgres://postgres:password@localhost:5432/orderdb
RABBITMQ_URL=amqp://localhost

🧩 frontend/.env.local
NEXT_PUBLIC_CUSTOMER_API=http://localhost:3001
NEXT_PUBLIC_ORDER_API=http://localhost:3002

4️⃣ Install Dependencies

Run this in each folder:

cd customer-service && npm install
cd product-order-service && npm install
cd frontend && npm install

5️⃣ Run Database Migrations & Seed Data
npm run migration:run
npm run seed


(Make sure PostgreSQL is running and credentials match your .env)

6️⃣ Start RabbitMQ

If you have Docker:

docker run -d --hostname rabbitmq --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management


Access the management UI at:
👉 http://localhost:15672

(Default login: guest / guest)

7️⃣ Run the Services

In separate terminals:

# Customer Service
cd customer-service
npm run start:dev

# Product/Order Service
cd order-service
npm run start:dev

# Frontend
cd frontend
npm run dev


Now visit 👉 http://localhost:3000

🧪 System Flow

Frontend fetches products from Product Service.

User adds items to cart and proceeds to checkout.

Frontend sends order details to Order Service.

Order Service saves the order and emits an event via RabbitMQ.

Customer Service receives the order_created event and links it to the customer.

User can view all their orders under the “My Orders” page.

🔌 API Documentation
🧍‍♀️ Customer Service
Method	Endpoint	Description
POST	/customers	

Create or return existing customer
GET	/customers/:id	Fetch a specific customer
GET	/customers/:id/orders	Get all orders for a customer
📦 Product & Order Service
Method	Endpoint	Description
GET	/products	Get all products
POST	/orders	Create a new order
GET	/orders/customer/:id	Get all orders by customer ID
GET	/orders/:id	Get details of one order
🧭 Example Request (Create Order)

POST /orders

{
  "customerId": 1,
  "totalPrice": 879.98,
  "items": [
    { "productId": 1, "quantity": 1, "price": 499.99 },
    { "productId": 2, "quantity": 2, "price": 189.99 }
  ]
}


Response

{
  "id": 11,
  "customerId": 1,
  "totalPrice": "879.98",
  "createdAt": "2025-10-30T12:05:42.151Z",
  "status": "pending",
  "items": [...]
}

🧰 Technologies Used

NestJS – Backend framework for microservices

TypeORM – ORM for database interaction

PostgreSQL – Relational database

RabbitMQ – Message broker for event-driven communication

Next.js (React) – Frontend framework

TailwindCSS – For styling UI components