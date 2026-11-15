import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedatProducts1752234742764 implements MigrationInterface {
  name = 'AddDeletedatProducts1752234742764';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate_products" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "affiliate_products" DROP COLUMN "deletedAt"`,
    );
  }
}
