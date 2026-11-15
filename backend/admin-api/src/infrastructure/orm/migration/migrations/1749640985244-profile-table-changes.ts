import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileTableChanges1749640985244 implements MigrationInterface {
  name = 'ProfileTableChanges1749640985244';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "relation"`);
    await queryRunner.query(
      `CREATE TYPE "public"."profile_relation_enum" AS ENUM('Husband', 'Wife', 'Fiancé', 'Boyfriend', 'Girlfriend', 'Son', 'Daughter', 'Father (Kid’s Grandpa)', 'Mother (Kid’s Grandma)', 'Best Friend', 'Friend')`,
    );
    await queryRunner.query(`ALTER TABLE "profile" ADD "relation" "public"."profile_relation_enum"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" DROP COLUMN "relation"`);
    await queryRunner.query(`DROP TYPE "public"."profile_relation_enum"`);
    await queryRunner.query(`ALTER TABLE "profile" ADD "relation" text`);
  }
}
