import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileModification1749121362484 implements MigrationInterface {
  name = 'ProfileModification1749121362484';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "profile" DROP COLUMN "date_of_birth"`,
    );
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "name"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" ADD "name" text NOT NULL`);
    await queryRunner.query(`ALTER TABLE "profile" ADD "date_of_birth" date`);
   
  }
}
