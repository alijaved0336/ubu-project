import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateProductRequestsTable1749134207322 implements MigrationInterface {
name = 'CreateProductRequestsTable1749134207322';
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the product_requests table
    await queryRunner.createTable(new Table({
      name: 'product_requests',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',  // auto-increment PK
        },
        {
          name: 'profile_id',
          type: 'int',
          isNullable: false,
        },
        {
          name: 'affiliate_product_id',
          type: 'int',
          isNullable: false,
        },
        {
          name: 'quantity',
          type: 'int',
          default: 1,
        },
        {
          name: 'status',
          type: 'enum',
          enum: ['pending', 'bought', 'cancelled', 'approved'],
          default: `'pending'`,
        },
        {
          name: 'created_at',
          type: 'timestamp',
          default: 'now()',  // default current timestamp:contentReference[oaicite:9]{index=9}
        },
        {
          name: 'updated_at',
          type: 'timestamp',
          default: 'now()',
        },
      ],
    }), true);

    // Add foreign key: profile_id -> profiles.id
    await queryRunner.createForeignKey('product_requests', new TableForeignKey({
      columnNames: ['profile_id'],
      referencedTableName: 'profile',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));
    // Add foreign key: affiliate_product_id -> affiliate_products.id
    await queryRunner.createForeignKey('product_requests', new TableForeignKey({
      columnNames: ['affiliate_product_id'],
      referencedTableName: 'affiliate_products',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign keys (replace these constraint names with your actual ones if different)
    await queryRunner.query(`ALTER TABLE "product_requests" DROP CONSTRAINT "FK_product_requests_profile"`);
    await queryRunner.query(`ALTER TABLE "product_requests" DROP CONSTRAINT "FK_product_requests_affiliate_product"`);
  
    // Drop the table
    await queryRunner.query(`DROP TABLE "product_requests"`);
  }
  
  
}
