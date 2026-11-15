import { MigrationInterface, QueryRunner } from "typeorm";

export class ProfileEnumUpdate1750171411210 implements MigrationInterface {
    name = 'ProfileEnumUpdate1750171411210'


    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."profile_relation_enum" RENAME TO "profile_relation_enum_old"`);

        await queryRunner.query(`
            CREATE TYPE "public"."profile_relation_enum" AS ENUM(
                'Husband', 
                'Wife', 
                'Fiancé', 
                'Boyfriend', 
                'Girlfriend', 
                'Son', 
                'Daughter', 
                'Father', 
                'Mother', 
                'Best Friend', 
                'Friend', 
                'Grandpa', 
                'Grandma'
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "profile"
            ALTER COLUMN "relation" TYPE "public"."profile_relation_enum"
            USING "relation"::text::"public"."profile_relation_enum"
        `);

        await queryRunner.query(`DROP TYPE "public"."profile_relation_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."profile_relation_enum" RENAME TO "profile_relation_enum_new"`);

        await queryRunner.query(`
            CREATE TYPE "public"."profile_relation_enum" AS ENUM(
                'Husband', 
                'Wife', 
                'Fiancé', 
                'Boyfriend', 
                'Girlfriend', 
                'Son', 
                'Daughter', 
                'Father (Kid’s Grandpa)', 
                'Mother (Kid’s Grandma)', 
                'Best Friend', 
                'Friend'
            )
        `);

        await queryRunner.query(`
            ALTER TABLE "profile"
            ALTER COLUMN "relation" TYPE "public"."profile_relation_enum"
            USING "relation"::text::"public"."profile_relation_enum"
        `);

        // Step 4: Drop the temporary enum type
        await queryRunner.query(`DROP TYPE "public"."profile_relation_enum_new"`);
    }

}
