import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProfileMigration1748945550350 implements MigrationInterface {
  name = 'ProfileMigration1748945550350';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" SERIAL NOT NULL, "name" text NOT NULL, "relation" text NOT NULL, "date_of_birth" date, "is_active" boolean NOT NULL DEFAULT true, "parent_user_id" integer NOT NULL, "child_user_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_3a9f93dc09034b42d386250137" UNIQUE ("child_user_id"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "index_profile_child_user" ON "profile" ("child_user_id") WHERE child_user_id IS NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_3cd781b567aa3c5480e531f8a55" FOREIGN KEY ("parent_user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_3a9f93dc09034b42d386250137e" FOREIGN KEY ("child_user_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_3a9f93dc09034b42d386250137e"`);
    await queryRunner.query(`ALTER TABLE "profile" DROP CONSTRAINT "FK_3cd781b567aa3c5480e531f8a55"`);
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
