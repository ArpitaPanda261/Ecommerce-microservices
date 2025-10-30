import { Controller, Logger } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';

@Controller()
export class CustomerEventsController {
  private readonly logger = new Logger(CustomerEventsController.name);

  @EventPattern('customer_created')
  handleCustomerCreated(@Payload() data: any) {
    this.logger.log(`📨 Received customer_created event: ${JSON.stringify(data)}`);
  }

  @EventPattern('customer_updated')
  handleCustomerUpdated(@Payload() data: any) {
    this.logger.log(`📨 Received customer_updated event: ${JSON.stringify(data)}`);
  }

  @EventPattern('customer_deleted')
  handleCustomerDeleted(@Payload() data: any) {
    this.logger.log(`📨 Received customer_deleted event: ${JSON.stringify(data)}`);
  }
}
