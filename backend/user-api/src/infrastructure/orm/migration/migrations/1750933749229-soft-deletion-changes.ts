import { MigrationInterface, QueryRunner } from 'typeorm';

export class SoftDeletionChanges1750933749229 implements MigrationInterface {
  name = 'SoftDeletionChanges1750933749229';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "body_measurements" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_favourites" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_visits" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_affiliate_products" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_favourites" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "proposals" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "product_favourites" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_affiliate_products" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_visits" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(`ALTER TABLE "cart" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "post_favourites" DROP COLUMN "deletedAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "body_measurements" DROP COLUMN "deletedAt"`,
    );
  }
}
