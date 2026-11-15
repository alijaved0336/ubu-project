import { MigrationInterface, QueryRunner } from "typeorm";

export class PriceAddAffiliateProduct1750173262923 implements MigrationInterface {
    name = 'PriceAddAffiliateProduct1750173262923'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate_products" ADD "price" numeric(10,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "affiliate_products" DROP COLUMN "price"`);
    }

}
