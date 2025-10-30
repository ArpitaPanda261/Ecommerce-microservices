import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './product/product.module';
import { OrdersModule } from './order/order.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { CustomerEventsController } from './events/customer.events.controller';
import { AppDataSource } from './data-source'; // ✅ use centralized DataSource

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    // Use shared DataSource for migrations + entities
    TypeOrmModule.forRoot(AppDataSource.options),

    // RabbitMQ setup for communicating with customer service
    ClientsModule.register([
      {
        name: 'CUSTOMER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'customer_queue',
          queueOptions: { durable: false },
        },
      },
    ]),

    ProductsModule,
    OrdersModule,
  ],
  controllers: [CustomerEventsController],
})
export class AppModule {}
