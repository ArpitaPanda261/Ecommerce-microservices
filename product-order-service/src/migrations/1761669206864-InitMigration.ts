import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1761669206864 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Product Table
    const productExists = await queryRunner.hasTable('product');
    if (!productExists) {
      await queryRunner.query(`
        CREATE TABLE "product" (
          "id" SERIAL PRIMARY KEY,
          "name" VARCHAR NOT NULL,
          "price" DECIMAL(10,2) NOT NULL,
          "description" VARCHAR NOT NULL,
          "stock" INT NOT NULL
        )
      `);
    }

    // Order Table
    const orderExists = await queryRunner.hasTable('"order"');
    if (!orderExists) {
      await queryRunner.query(`
        CREATE TABLE "order" (
          "id" SERIAL PRIMARY KEY,
          "customerId" INT NOT NULL,
          "totalPrice" DECIMAL(10,2) NOT NULL,
          "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          "status" VARCHAR DEFAULT 'pending'
        )
      `);
    }

    // OrderItem Table
    const orderItemExists = await queryRunner.hasTable('order_item');
    if (!orderItemExists) {
      await queryRunner.query(`
        CREATE TABLE "order_item" (
          "id" SERIAL PRIMARY KEY,
          "productId" INT NOT NULL,
          "price" DECIMAL(10,2) NOT NULL,
          "quantity" INT NOT NULL,
          "orderId" INT,
          CONSTRAINT "FK_order_item_order"
            FOREIGN KEY ("orderId") REFERENCES "order"("id")
            ON DELETE CASCADE
        )
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "order_item"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "order"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "product"`);
  }
}
