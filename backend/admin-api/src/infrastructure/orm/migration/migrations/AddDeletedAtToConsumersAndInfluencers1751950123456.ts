import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeletedAtToConsumersAndInfluencers1751950123456 implements MigrationInterface {
  name = 'AddDeletedAtToConsumersAndInfluencers1751950123456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "consumers" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "influencers" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "influencers" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "consumers" DROP COLUMN "deletedAt"`);
  }
}
