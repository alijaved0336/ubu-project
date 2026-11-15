import { MigrationInterface, QueryRunner } from "typeorm";

export class WithdrawalHistory1749560579060 implements MigrationInterface {
    name = 'WithdrawalHistory1749560579060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."withdrawal_history_status_enum" AS ENUM('pending', 'succeeded', 'failed')`);
        await queryRunner.query(`CREATE TABLE "withdrawal_history" ("id" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "currency" character varying(10) NOT NULL DEFAULT 'USD', "status" "public"."withdrawal_history_status_enum" NOT NULL DEFAULT 'pending', "failure_reason" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "influencer_id" integer NOT NULL, "stripe_connected_account_id" integer NOT NULL, CONSTRAINT "PK_2447cd2b5001ddf81a7351e12ec" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "withdrawal_history" ADD CONSTRAINT "fk_withdrawal_history_influencer" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "withdrawal_history" ADD CONSTRAINT "fk_withdrawal_history_stripe_account" FOREIGN KEY ("stripe_connected_account_id") REFERENCES "stripe_connected_accounts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "withdrawal_history" DROP CONSTRAINT "fk_withdrawal_history_stripe_account"`);
        await queryRunner.query(`ALTER TABLE "withdrawal_history" DROP CONSTRAINT "fk_withdrawal_history_influencer"`);
        await queryRunner.query(`DROP TABLE "withdrawal_history"`);
        await queryRunner.query(`DROP TYPE "public"."withdrawal_history_status_enum"`);
    }

}
