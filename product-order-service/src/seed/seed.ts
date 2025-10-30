import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { Product } from '../product/product.entity';
import { Order } from '../order/order.entity';
import { OrderItem } from '../order/order-item.entity';

async function seed() {
  try {
    console.log('🌱 Initializing database connection...');
    await AppDataSource.initialize();

    const productRepo = AppDataSource.getRepository(Product);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);

    // ✅ Seed Products
    const products = [
      { name: 'Laptop', price: 999.99, description: 'Gaming laptop', stock: 10 },
      { name: 'Mouse', price: 49.99, description: 'Wireless mouse', stock: 50 },
      { name: 'Keyboard', price: 79.99, description: 'Mechanical keyboard', stock: 30 },
    ];

    for (const p of products) {
      const existing = await productRepo.findOne({ where: { name: p.name } });
      if (!existing) {
        await productRepo.save(p);
        console.log(`✅ Inserted product: ${p.name}`);
      } else {
        console.log(`⚠️ Product already exists: ${p.name}`);
      }
    }

    // ✅ Seed an Order (with OrderItems)
    const allProducts = await productRepo.find();
    if (allProducts.length > 0) {
      const order = orderRepo.create({
        customerId: 1,
        totalPrice: allProducts[0].price + allProducts[1].price,
        status: 'pending',
      });
      await orderRepo.save(order);

      const items = [
        {
          productId: allProducts[0].id,
          price: allProducts[0].price,
          quantity: 1,
          order,
        },
        {
          productId: allProducts[1].id,
          price: allProducts[1].price,
          quantity: 2,
          order,
        },
      ];

      await orderItemRepo.save(items);
      console.log(`✅ Created order #${order.id} with ${items.length} items`);
    }

    console.log('🌱 Product & Order seeding completed successfully.');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

seed();
