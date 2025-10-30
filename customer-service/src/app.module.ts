import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CustomersModule } from './customer/customers.module';
import { Transport } from '@nestjs/microservices/enums/transport.enum';
import { ClientsModule } from '@nestjs/microservices/module/clients.module';
import { OrderEventsController } from './events/customer-events.controller';
import { AppDataSource } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(AppDataSource.options),

    ClientsModule.register([
      {
        name: 'PRODUCT_ORDER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'customer_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
    CustomersModule,
  ],
  controllers: [OrderEventsController],
})
export class AppModule {}
