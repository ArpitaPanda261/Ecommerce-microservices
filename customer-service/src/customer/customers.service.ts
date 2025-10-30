import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './customer.entity';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ClientProxy } from '@nestjs/microservices';
import axios from 'axios';

// ✅ Move interface OUTSIDE the class
interface OrderResponse {
  id: number;
  customerId: number;
  orderDate: Date;
  // Add other order properties as needed
}

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,

    @Inject('PRODUCT_ORDER_SERVICE')
    private readonly productOrderClient: ClientProxy,
  ) {}

  async create(createCustomerDto: CreateCustomerDto): Promise<Customer> {
    const customer = this.customerRepository.create(createCustomerDto);
    const saved = await this.customerRepository.save(customer);

    // Emit event
    this.productOrderClient.emit('customer_created', saved);
    return saved;
  }

  async findAll(): Promise<Customer[]> {
    return await this.customerRepository.find();
  }

  async findOne(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({ where: { id } });
    if (!customer)
      throw new NotFoundException(`Customer with ID ${id} not found`);
    return customer;
  }

  async update(id: number, updateData: Partial<Customer>): Promise<Customer> {
    await this.customerRepository.update(id, updateData);
    const updated = await this.findOne(id);

    // Emit event
    this.productOrderClient.emit('customer_updated', updated);
    return updated;
  }

  async remove(id: number): Promise<void> {
    const customer = await this.findOne(id);
    await this.customerRepository.delete(id);

    // Emit event
    this.productOrderClient.emit('customer_deleted', {
      id,
      name: customer.name,
    });
  }

  // ✅ Fetch all orders for a given customer
  async getCustomerOrders(id: number) {
    const customer = await this.findOne(id);
    if (!customer)
      throw new NotFoundException(`Customer with ID ${id} not found`);

    try {
      const { data } = await axios.get<OrderResponse[]>(
        `http://localhost:3002/orders/customer/${id}`,
      );
      return data;
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('❌ Failed to fetch customer orders:', errMsg);
      throw new NotFoundException('Unable to fetch customer orders');
    }
  }
}
