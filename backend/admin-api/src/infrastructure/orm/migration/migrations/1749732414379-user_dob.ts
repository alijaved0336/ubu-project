import { MigrationInterface, QueryRunner } from "typeorm";

export class UserDob1749732414379 implements MigrationInterface {
    name = 'UserDob1749732414379'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "dob" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "dob"`);
    }

}
