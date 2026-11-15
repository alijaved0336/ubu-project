import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileIsDepMig1749819338864 implements MigrationInterface {
  name = 'ProfileIsDepMig1749819338864';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDependant"`);
    await queryRunner.query(`ALTER TABLE "profile" ADD "isDependant" boolean DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "isDependant"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "isDependant" boolean DEFAULT true`);
  }
}
