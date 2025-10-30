import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class OrderEventsController {
  private readonly logger = new Logger(OrderEventsController.name);

  @EventPattern('order_created')
  handleOrderCreated(@Payload() data: any) {
    this.logger.log(`📦 Received order_created event: ${JSON.stringify(data)}`);
    // Optional: Update customer stats, send notification, etc.
  }

  @EventPattern('order_deleted')
  handleOrderDeleted(@Payload() data: any) {
    this.logger.log(`❌ Received order_deleted event: ${JSON.stringify(data)}`);
  }
}
