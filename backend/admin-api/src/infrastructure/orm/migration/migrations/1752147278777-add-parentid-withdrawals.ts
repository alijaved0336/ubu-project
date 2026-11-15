import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddParentidWithdrawals1752147278777 implements MigrationInterface {
  name = 'AddParentidWithdrawals1752147278777';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "withdrawal_history" ADD "parent_influencer_id" integer`);
    await queryRunner.query(
      `ALTER TABLE "withdrawal_history" ADD CONSTRAINT "fk_withdrawal_history_parent_influencer" FOREIGN KEY ("parent_influencer_id") REFERENCES "influencers"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`ALTER TABLE "withdrawal_history" ADD "user_name" varchar(100) NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "withdrawal_history" DROP COLUMN "user_name"`);
    await queryRunner.query(`ALTER TABLE "withdrawal_history" DROP CONSTRAINT "fk_withdrawal_history_parent_influencer"`);
    await queryRunner.query(`ALTER TABLE "withdrawal_history" DROP COLUMN "parent_influencer_id"`);
  }
}
