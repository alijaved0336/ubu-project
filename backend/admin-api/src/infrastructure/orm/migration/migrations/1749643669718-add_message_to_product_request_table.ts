import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMessageToProductRequestTable1749643669718 implements MigrationInterface {
    name = 'AddMessageToProductRequestTable1749643669718'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_requests" ADD "message" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_requests" DROP COLUMN "message"`);
    }

}
