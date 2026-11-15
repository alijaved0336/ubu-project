import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileDeletionColumn1751029787601 implements MigrationInterface {
  name = 'ProfileDeletionColumn1751029787601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "deletedAt"`);
  }
}
