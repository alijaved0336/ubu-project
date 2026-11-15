import { MigrationInterface, QueryRunner } from 'typeorm';

export class BrandAvatar1752061189278 implements MigrationInterface {
  name = 'BrandAvatar1752061189278';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "brands" ADD "avatar" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "brands" DROP COLUMN "avatar"`);
  }
}
