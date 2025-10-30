import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitMigration1761667551002 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if table exists
    const tableExists = await queryRunner.hasTable('customer');
    if (!tableExists) {
      await queryRunner.query(`
                CREATE TABLE "customer" (
                    "id" SERIAL NOT NULL,
                    "name" character varying NOT NULL,
                    "email" character varying NOT NULL,
                    "address" character varying,
                    CONSTRAINT "UQ_customer_email" UNIQUE ("email"),
                    CONSTRAINT "PK_customer_id" PRIMARY KEY ("id")
                )
            `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "customer"`);
  }
}
