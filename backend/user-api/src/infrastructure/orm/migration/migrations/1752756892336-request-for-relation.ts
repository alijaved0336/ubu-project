import { MigrationInterface, QueryRunner } from 'typeorm';

export class RequestForRelation1752756892336 implements MigrationInterface {
  name = 'RequestForRelation1752756892336';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."user_request_relationtype_enum" AS ENUM('Husband', 'Wife', 'Fiancé', 'Boyfriend', 'Girlfriend', 'Son', 'Daughter', 'Father', 'Mother', 'Best Friend', 'Friend', 'Grandpa', 'Grandma')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_request_requestfor_enum" AS ENUM('Parent', 'Child')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."user_request_status_enum" AS ENUM('Pending', 'Accepted', 'Rejected')`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_request" ("id" SERIAL NOT NULL, "requester_id" integer NOT NULL, "requestee_id" integer NOT NULL, "relationType" "public"."user_request_relationtype_enum" NOT NULL, "requestFor" "public"."user_request_requestfor_enum" NOT NULL, "status" "public"."user_request_status_enum" NOT NULL DEFAULT 'Pending', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_5a8702f28aa636f59038532bb85" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_request" ADD CONSTRAINT "FK_767569174fa006eb4a926512c3f" FOREIGN KEY ("requester_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_request" ADD CONSTRAINT "FK_6879e7647272955f95e85aff1f2" FOREIGN KEY ("requestee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_request" DROP CONSTRAINT "FK_6879e7647272955f95e85aff1f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_request" DROP CONSTRAINT "FK_767569174fa006eb4a926512c3f"`,
    );

    await queryRunner.query(`DROP TABLE "user_request"`);
    await queryRunner.query(`DROP TYPE "public"."user_request_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."user_request_requestfor_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."user_request_relationtype_enum"`,
    );
  }
}
