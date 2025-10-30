import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { CreateOrderDto } from './dto/orders.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(OrderItem)
    private readonly itemRepo: Repository<OrderItem>,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    // Create base order object
    const order = this.orderRepo.create({
      customerId: dto.customerId,
      totalPrice: dto.totalPrice,
      createdAt: new Date(),
    });

    // Save the base order
    const savedOrder = await this.orderRepo.save(order);

    // Create and save the related order items
    const items = dto.items.map((item) =>
      this.itemRepo.create({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        order: savedOrder, // relation
      }),
    );

    await this.itemRepo.save(items);

    // Return the full order with items loaded
    const createdOrder = await this.orderRepo.findOne({
      where: { id: savedOrder.id },
      relations: ['items'],
    });

    if (!createdOrder)
      throw new NotFoundException(`Order with ID ${savedOrder.id} not found`);

    this.customerClient.emit('order_created', {
      id: createdOrder.id,
      customerId: createdOrder.customerId,
      totalPrice: createdOrder.totalPrice,
      items: createdOrder.items,
    });

    return createdOrder;
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['items'] });
  }

  async findOne(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items'],
    });
    if (!order) throw new NotFoundException(`Order with ID ${id} not found`);
    return order;
  }

  async findByCustomer(customerId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { customerId },
      relations: ['items'],
    });
  }

  async remove(id: number): Promise<{ message: string }> {
    const order = await this.findOne(id);
    await this.orderRepo.remove(order);
    return { message: `Order with ID ${id} deleted successfully` };
  }
}
