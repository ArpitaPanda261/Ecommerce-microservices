import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { ProductsController } from './product.controller';
import { ProductsService } from './product.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])], // registers the Product entity
  controllers: [ProductsController], // handles API routes
  providers: [ProductsService], // handle logic (service)
  exports: [ProductsService], // export service for use in other modules
})
export class ProductsModule {}
