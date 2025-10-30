import 'reflect-metadata';
import { AppDataSource } from '../data-source';
import { Customer } from '../customer/customer.entity';

async function seed() {
  try {
    console.log('🌱 Initializing database connection...');
    await AppDataSource.initialize();

    const customerRepo = AppDataSource.getRepository(Customer);

    const customers = [
      {
        name: 'Arpita Panda',
        email: 'arpita@example.com',
        address: 'Bhubaneswar',
      },
      { name: 'Rahul Sharma', email: 'rahul@example.com', address: 'Cuttack' },
      { name: 'Neha Das', email: 'neha@example.com', address: 'Puri' },
    ];

    for (const customer of customers) {
      const exists = await customerRepo.findOne({
        where: { email: customer.email },
      });
      if (!exists) {
        await customerRepo.save(customer);
        console.log(`✅ Inserted customer: ${customer.name}`);
      } else {
        console.log(`⚠️ Customer already exists: ${customer.name}`);
      }
    }

    console.log('Customer seeding completed successfully.');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

void seed();
