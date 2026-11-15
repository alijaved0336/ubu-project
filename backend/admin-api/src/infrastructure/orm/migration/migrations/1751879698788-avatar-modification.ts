import { MigrationInterface, QueryRunner } from 'typeorm';

export class AvatarModification1751879698788 implements MigrationInterface {
  name = 'AvatarModification1751879698788';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "influencers" ADD "avatar" text`);
    await queryRunner.query(`ALTER TABLE "consumers" ADD "avatar" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "consumers" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "influencers" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "avatar" text`);
  }
}
