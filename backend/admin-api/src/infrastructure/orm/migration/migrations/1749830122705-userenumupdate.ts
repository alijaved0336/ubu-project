import { MigrationInterface, QueryRunner } from 'typeorm';

export class Userenumupdate1749830122705 implements MigrationInterface {
  name = 'Userenumupdate1749830122705';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TYPE "public"."questionnaires_user_type_enum" ADD VALUE 'minorinfluencer'`);
    await queryRunner.query(`ALTER TYPE "public"."questionnaires_user_type_enum" ADD VALUE 'minorconsumer'`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE "public"."questionnaires_user_type_enum"`);
  }
}
