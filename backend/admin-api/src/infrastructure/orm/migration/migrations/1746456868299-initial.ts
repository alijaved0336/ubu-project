import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1746456868299 implements MigrationInterface {
  name = 'Initial1746456868299';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "exhibit_documents" ("id" SERIAL NOT NULL, "campaign_id" integer NOT NULL, "document_order" integer NOT NULL, "description" text NOT NULL, "hashtags" text array, "number_of_deliverables" json NOT NULL, "campaign_acceptance_deadline" date NOT NULL, "publication_dates" date NOT NULL, "total_compensation" numeric NOT NULL, "brand_guidelines" text, "number_of_revisions" integer, "turn_around_time" integer, "special_conditions" text, "additional_requirements" text, "document_url" character varying NOT NULL, "advertisemnt_url" text, "product_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_61cf3c6d8cb7dfb74cec0023c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaign_comments" ("id" SERIAL NOT NULL, "campaign_id" integer NOT NULL, "comment" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_acf7bd8a95122ef6716b5c30bdc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contracts" ("id" SERIAL NOT NULL, "brand_sign_url" text, "influencer_sign_url" text, "document_url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "campaign_id" integer, CONSTRAINT "REL_f26bf71f8e313b79d02a0df1b6" UNIQUE ("campaign_id"), CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "admin_reviews" ("id" SERIAL NOT NULL, "reviewer_id" integer NOT NULL, "reviewer_type" character varying NOT NULL, "reviewable_id" integer NOT NULL, "campaign_id" integer NOT NULL, "reviewable_type" character varying NOT NULL, "rating" double precision NOT NULL, "comment" text, "is_anonymous" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_83789601913ddee43f858395f8c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_admin_reviews_reviewable_type" ON "admin_reviews" ("reviewable_type") `);
    await queryRunner.query(`CREATE INDEX "IDX_admin_reviews_reviewer_type" ON "admin_reviews" ("reviewer_type") `);
    await queryRunner.query(
      `CREATE TABLE "chat_users" ("id" SERIAL NOT NULL, "joinedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "chat_id" integer, CONSTRAINT "PK_45f77b7b90225045d6bf7f13756" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chats" ("id" SERIAL NOT NULL, "unread_messages_count" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_0117647b3c4a4e5ff198aeb6206" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "chat_messages" ("id" SERIAL NOT NULL, "message" text NOT NULL, "is_seen" boolean NOT NULL DEFAULT false, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "file_name" character varying, "file_url" character varying, "sender_id" integer, "chat_id" integer, CONSTRAINT "REL_9e5fc47ecb06d4d7b84633b171" UNIQUE ("sender_id"), CONSTRAINT "PK_40c55ee0e571e268b0d3cd37d10" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "notifications" ("id" SERIAL NOT NULL, "receiver_type" text, "sender_type" text, "content" text NOT NULL, "type" text NOT NULL, "isSeen" boolean NOT NULL, "date" TIMESTAMP NOT NULL DEFAULT now(), "sender_id" integer, "receiver_id" integer, "campaign_id" integer, "chat_id" integer, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."fund_releases_status_enum" AS ENUM('pending', 'transferred', 'failed', 'in-progress')`);
    await queryRunner.query(
      `CREATE TABLE "fund_releases" ("id" SERIAL NOT NULL, "amount" numeric(10,2) NOT NULL, "transfer_id" character varying(255), "status" "public"."fund_releases_status_enum" NOT NULL DEFAULT 'pending', "is_refundable" boolean NOT NULL DEFAULT false, "cooling_period_end" TIMESTAMP, "fund_released_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "campaign_payment_id" integer, "influencer_id" integer, "user_id" integer, CONSTRAINT "PK_f9ae552e036aea01f87cb017e01" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."refunds_status_enum" AS ENUM('requested', 'approved', 'rejected', 'completed', 'failed')`);
    await queryRunner.query(
      `CREATE TABLE "refunds" ("id" SERIAL NOT NULL, "amount" integer NOT NULL, "status" "public"."refunds_status_enum" NOT NULL DEFAULT 'requested', "reason" character varying(255), "transaction_id" character varying(255), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "campaign_payment_id" integer, "user_id" integer, CONSTRAINT "PK_5106efb01eeda7e49a78b869738" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campaign_payments_status_enum" AS ENUM('pending', 'payment-held', 'succeeded', 'refund-requested', 'refunded', 'transferred', 'in-complete')`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaign_payments" ("id" SERIAL NOT NULL, "payment_intent_id" text NOT NULL, "status" "public"."campaign_payments_status_enum" NOT NULL DEFAULT 'pending', "amount" numeric(10,2) NOT NULL, "currency" character varying(10) NOT NULL DEFAULT 'USD', "metadata" jsonb, "is_transferred" boolean NOT NULL DEFAULT false, "refunded_amount" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "campaign_id" integer, "user_id" integer, CONSTRAINT "PK_11e500119705e31108bb905f92e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."campaign_disputes_status_enum" AS ENUM('pending', 'in-progress', 'resolved', 'rejected')`);
    await queryRunner.query(
      `CREATE TYPE "public"."campaign_disputes_campaign_last_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'in-progress', 'contract-signing', 'submitted', 'disputed', 'completed', 'publishing', 'payment-held', 'funds-transferred', 'rejected-refunded')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campaign_disputes_resolution_action_enum" AS ENUM('refund_to_brand', 'release_funds_to_influencer', 'restart_campaign', 'pending')`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaign_disputes" ("id" SERIAL NOT NULL, "is_refund_requested" boolean NOT NULL DEFAULT false, "status" "public"."campaign_disputes_status_enum" NOT NULL DEFAULT 'pending', "campaign_last_status" "public"."campaign_disputes_campaign_last_status_enum" NOT NULL DEFAULT 'in-progress', "admin_remarks" text, "influencer_concerns" text, "brand_concerns" text, "resolution_action" "public"."campaign_disputes_resolution_action_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "campaign_id" integer, "raised_by_id" integer, "against_id" integer, CONSTRAINT "PK_0f76b2f47ec6f8551e579261288" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."campaigns_status_enum" AS ENUM('pending', 'accepted', 'rejected', 'in-progress', 'contract-signing', 'submitted', 'disputed', 'completed', 'publishing', 'payment-held', 'funds-transferred', 'rejected-refunded')`,
    );
    await queryRunner.query(
      `CREATE TABLE "campaigns" ("id" SERIAL NOT NULL, "segment_id" integer NOT NULL, "influencer_id" integer NOT NULL, "brand_id" integer NOT NULL, "campaign_name" character varying, "review_notify_count" integer, "status" "public"."campaigns_status_enum" NOT NULL DEFAULT 'pending', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_4d0f69a23f991dbd8fdc60a27bb" UNIQUE ("segment_id"), CONSTRAINT "UQ_c579ff1f9a5657e1d45443e496d" UNIQUE ("influencer_id"), CONSTRAINT "UQ_cd8ba988ed1ce77f807c8f900c4" UNIQUE ("brand_id"), CONSTRAINT "PK_831e3fcd4fc45b4e4c3f57a9ee4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "segments" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "brand_id" integer NOT NULL, "saved_filter" jsonb, "marked_candidates" jsonb DEFAULT '[]', CONSTRAINT "PK_beff1eec19679fe8ad4f291f04e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."oauth_credentials_creds_type_enum" AS ENUM('amazon', 'shopify')`);
    await queryRunner.query(
      `CREATE TABLE "oauth_credentials" ("id" SERIAL NOT NULL, "refresh_token" text NOT NULL, "access_token" text NOT NULL, "seller_id" text NOT NULL, "creds_type" "public"."oauth_credentials_creds_type_enum" NOT NULL DEFAULT 'amazon', "token_expiry" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP, "brand_id" integer, CONSTRAINT "REL_20d996efe143297b813e2879a1" UNIQUE ("brand_id"), CONSTRAINT "PK_3d22936311700e5d316d1c9bfc4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "brands" ("id" SERIAL NOT NULL, "brand_name" text, "description" text, "company_website" text, "job_title" text, "max_disputes" integer NOT NULL DEFAULT '3', "is_blocked" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP, "user_id" integer, CONSTRAINT "REL_5d26f3a7d19d380538c9dd57d0" UNIQUE ("user_id"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sizes" ("id" SERIAL NOT NULL, "label" character varying NOT NULL, "sub_category_ids" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_09ffc681886e25eb5ce3b319fab" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_sizes" ("id" SERIAL NOT NULL, "dimensions" jsonb, "active" boolean DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, "size_id" integer, CONSTRAINT "PK_19c3d021f81c5b1ff367bad6164" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sub_categories" ("id" SERIAL NOT NULL, "name" text NOT NULL, "type" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "gender_ids" text NOT NULL, "required_columns" text array, "category_id" integer, CONSTRAINT "PK_f319b046685c0e07287e76c5ab1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" text, "description" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "gender" ("id" SERIAL NOT NULL, "name" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_98a711129bc073e6312d08364e8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "body_measurements" ("id" SERIAL NOT NULL, "scan_id" text, "body_composition" json, "custom_scan_id" text, "input" json, "measurements" jsonb, "member_id" text, "posture" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_474282e620ea0cd4fe5d8cbce0f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "demographics" ("id" SERIAL NOT NULL, "height" double precision, "weight" double precision, "body_type" text, "hair_color" text, "eye_color" text, "skin_tone" text, "distinctive_features" text, "overall_aesthetic" text, "style_and_personality" text, "fashion_style" text, "personal_style" text, "personality_traits" text, "lifestyle" text, "values_and_beliefs" text, "hobbies_and_interest" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "influencer_id" integer, "consumer_id" integer, CONSTRAINT "REL_b4e62cdb7757c84f1fb0144a46" UNIQUE ("influencer_id"), CONSTRAINT "REL_7666d3f29cc9132d3b7e0bc4d4" UNIQUE ("consumer_id"), CONSTRAINT "PK_17bf4db5727bd0ad0462c67eda9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_favourites" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "consumer_id" integer, "post_id" integer, CONSTRAINT "PK_de665eb8df6ba6dfc7f4ccb7a5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cart" ("id" SERIAL NOT NULL, "quantity" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "consumer_id" integer, "product_id" integer, CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "reviews" ("id" SERIAL NOT NULL, "rating" double precision, "comment" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "consumer_id" integer, CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_visits" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "consumer_id" integer, "post_id" integer, CONSTRAINT "PK_1ab6f5a2d62a8af3180736d3479" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "affiliate_products" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" text NOT NULL, "images" jsonb array NOT NULL, "link" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "post_id" integer, CONSTRAINT "PK_76b3486aea709c0bb1986b11633" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "favorite_affiliate_products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "consumer_id" integer, "affiliate_product_id" integer, CONSTRAINT "PK_c2a213967bfcf36f8ffdb672b21" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "consumers" ("id" SERIAL NOT NULL, "tiktok_handle" text, "instagram_handle" text, "facebook_handle" text, "start_budget" text, "end_budget" text, "region" text, "gender" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, "measurement_id" integer, CONSTRAINT "REL_f984e14f0ee97c4ed6c1a17909" UNIQUE ("user_id"), CONSTRAINT "REL_6fa8e9d76eb63ac7d642fa30e0" UNIQUE ("measurement_id"), CONSTRAINT "PK_9355367764efa60a8c2c27856d0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_favourites" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "consumer_id" integer, "product_id" integer, "post_id" integer, "post_product_id" integer, CONSTRAINT "PK_931c81cc4b83f5624d23d23576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "style" ("id" SERIAL NOT NULL, "name" text, "tags" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_12a3ba7fe23b5386181ac6b0ac0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "name" text, "description" text, "price" integer, "currency" text, "media" jsonb, "tags" text array, "colors" jsonb, "style" text array, "status" boolean, "material" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_link" text NOT NULL, "brand_id" integer, "category_id" integer, "sub_category_id" integer, "review_id" integer, "gender_id" integer, "style_id" integer, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_products" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "product_id" integer, "post_id" integer, CONSTRAINT "PK_330602f16c0a95e384b4ee87411" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "influencer_profiles" ("id" SERIAL NOT NULL, "influencer_id" integer NOT NULL, "post_id" integer NOT NULL, "is_pinned" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_12a21de42382536c5b66fb106a0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" text, "body" text, "status" text, "product_data" json NOT NULL DEFAULT '[]', "media" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "tags" text array, "influencer_id" integer, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."proposals_status_enum" AS ENUM('draft', 'published')`);
    await queryRunner.query(
      `CREATE TABLE "proposals" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "body" text NOT NULL, "status" "public"."proposals_status_enum" NOT NULL, "influencer_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_db524c8db8e126a38a2f16d8cac" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "instagram_stats" ("id" SERIAL NOT NULL, "followers_count" integer NOT NULL, "engagement_rate" text, "conversion_rate" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "influencer_id" integer, CONSTRAINT "REL_194b04bb10318ce0aa71c88850" UNIQUE ("influencer_id"), CONSTRAINT "PK_51f493665d289339a15769bdd40" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."stripe_connected_accounts_status_enum" AS ENUM('completed', 'pending', 'in-progress', 'in-active')`);
    await queryRunner.query(
      `CREATE TABLE "stripe_connected_accounts" ("id" SERIAL NOT NULL, "stripe_connected_account_id" text NOT NULL, "status" "public"."stripe_connected_accounts_status_enum" NOT NULL DEFAULT 'in-active', "influencer_id" integer, CONSTRAINT "REL_df62440f5757c064ef40ef3c6f" UNIQUE ("influencer_id"), CONSTRAINT "PK_1e9057f9b4a0ca55dfc565339c1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "influencers" ("id" SERIAL NOT NULL, "tiktok_handle" text, "instagram_handle" text, "facebook_handle" text, "gallery_images" text, "following" integer, "engagment_rate" double precision, "conversion_rate" double precision, "rating" double precision, "avg_response_time" text, "bio" text, "profile_picture_url" text, "reviews_count" integer, "start_budget" integer, "end_budget" integer, "region" text, "ff" integer, "sports" text, "dob" date, "measurement_id" integer, "style" text, "language" text, "ehtincity" text, "audience_region" text, "cultural_background" text, "phone" text, "earning_experience" boolean, "is_show_modal" boolean NOT NULL DEFAULT true, "potential_brands" jsonb DEFAULT '[]', "max_disputes" integer NOT NULL DEFAULT '3', "is_blocked" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "REL_08bb7678deabfeec3acb7e4ab8" UNIQUE ("user_id"), CONSTRAINT "REL_fcf92a228fda12ac1054993559" UNIQUE ("measurement_id"), CONSTRAINT "PK_a5bbdc11f7898f2a695208b337a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "follows" ("id" SERIAL NOT NULL, "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "follower_id" integer, "followee_id" integer, CONSTRAINT "PK_8988f607744e16ff79da3b8a627" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "social_integrations" ("id" SERIAL NOT NULL, "social_platform_name" character varying(50) NOT NULL, "access_token" character varying(255) NOT NULL, "token_last_updated" TIMESTAMP NOT NULL DEFAULT now(), "social_user_id" character varying(50) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "UQ_8d84909dc0750942513d9e546b4" UNIQUE ("user_id", "social_platform_name"), CONSTRAINT "PK_ea201ec4e7decb6bbe4d0fcf27c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."questionnaires_user_type_enum" AS ENUM('consumer', 'influencer', 'brand', 'segment')`);
    await queryRunner.query(
      `CREATE TYPE "public"."questionnaires_layout_enum" AS ENUM('simpleCheckbox', 'checkboxCard', 'simpleRadio', 'radioCard', 'checkboxCardSmall')`,
    );
    await queryRunner.query(
      `CREATE TABLE "questionnaires" ("id" SERIAL NOT NULL, "title" text, "question" text, "description" text, "is_multi_selected" boolean NOT NULL DEFAULT false, "is_optional" boolean NOT NULL DEFAULT false, "selection_limit" integer NOT NULL DEFAULT '1', "sr_no" integer NOT NULL, "question_category_sr_no" integer, "category_sub_question_sr_no" integer, "options" text array, "question_category" text, "question_category_description" text, "user_type" "public"."questionnaires_user_type_enum" NOT NULL DEFAULT 'consumer', "layout" "public"."questionnaires_layout_enum", "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a01d7cdea895ed9796b29233610" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_answers" ("id" SERIAL NOT NULL, "selected_options" text array, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "question_id" integer, "user_id" integer, CONSTRAINT "PK_08977c1a2a5f1b8b472dbd87d04" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."ubu_subscriptions_plan_type_enum" AS ENUM('basic', 'professional', 'enterprise')`);
    await queryRunner.query(
      `CREATE TABLE "ubu_subscriptions" ("id" SERIAL NOT NULL, "subs_start_date" TIMESTAMP NOT NULL, "subs_end_date" TIMESTAMP NOT NULL, "stripe_subscription_id" text NOT NULL, "cancel_at_period_end" text, "stripe_invoice_id" text NOT NULL, "price" text NOT NULL, "price_id" text NOT NULL, "interval" text NOT NULL, "product_id" text NOT NULL, "plan_type" "public"."ubu_subscriptions_plan_type_enum" NOT NULL DEFAULT 'basic', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_3498e331e8a5c96cf639d4058fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tags" ("id" SERIAL NOT NULL, "tag_name" text NOT NULL, "user_id" integer, CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_tags" ("id" SERIAL NOT NULL, "blog_id" integer, "tag_id" integer, CONSTRAINT "PK_8880485f371f1892310811845c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blogs" ("id" SERIAL NOT NULL, "title" text, "description" text, "media" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_e113335f11c926da929a625f118" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "forgot_password_tokens" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_95ad636b36a2b621f78427600a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessionlog" ("id" SERIAL NOT NULL, "login_timestamp" character varying, "ip_address" character varying, "operating_system" character varying, "browsing_info" character varying, "device_type" character varying, "user_id" integer, CONSTRAINT "PK_eece94bd9265ba07eb6aa878263" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "whats_new" ("id" SERIAL NOT NULL, "title" text NOT NULL, "description" text NOT NULL, "tags" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_907d6b98599b9ba35dae30cdd5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_errors" ("id" SERIAL NOT NULL, "message" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "PK_5bcf3b57f852f1cf590ef90461e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."influencer_payments_status_enum" AS ENUM('pending', 'in-progress', 'succeeded', 'failed')`);
    await queryRunner.query(
      `CREATE TABLE "influencer_payments" ("id" SERIAL NOT NULL, "transfer_id" character varying(255), "status" "public"."influencer_payments_status_enum" NOT NULL DEFAULT 'pending', "amount" integer NOT NULL DEFAULT '0', "currency" character varying(10) NOT NULL DEFAULT 'USD', "month" character varying(10) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_b70fb7c9ecb660cb2288953d7b8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_searches" ("id" SERIAL NOT NULL, "search_string" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer, CONSTRAINT "PK_7c02c136d33604d6add483d34af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."user_sign_in_method_enum" AS ENUM('manual', 'google', 'apple', 'instagram', 'facebook')`);
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" text NOT NULL, "first_name" text, "phone_number" text, "last_name" text, "password" text NOT NULL, "avatar" text, "stripe_customer_id" text, "refresh_token" text, "is_brand" boolean NOT NULL DEFAULT false, "is_influencer" boolean NOT NULL DEFAULT false, "sign_in_method" "public"."user_sign_in_method_enum" NOT NULL DEFAULT 'manual', "is_consumer" boolean NOT NULL DEFAULT false, "is_deleted" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "is_admin" boolean NOT NULL DEFAULT false, "is_questionnaire_completed" boolean NOT NULL DEFAULT false, "address" text, "city" text, "state" text, "zip_code" character varying(10), "email_verified" boolean NOT NULL DEFAULT false, "apple_identifier" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE UNIQUE INDEX "index_user_email" ON "user" ("email") `);
    await queryRunner.query(
      `CREATE TABLE "whats_new_seen_by" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "whats_new_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "PK_1466732ff68000beb63edb69890" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "weekly_tracking_summaries" ("id" SERIAL NOT NULL, "tracking_id" character varying(255) NOT NULL, "week_start_date" date NOT NULL, "week_end_date" date NOT NULL, "clicks" integer NOT NULL DEFAULT '0', "items_ordered" integer NOT NULL DEFAULT '0', "items_shipped" integer NOT NULL DEFAULT '0', "revenue" numeric(10,2) NOT NULL DEFAULT '0', "ad_fees" numeric(10,2) NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "brand_id" integer NOT NULL, "influencer_id" integer NOT NULL, CONSTRAINT "PK_1fd0a8b86ff56c112996515d94b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."subscribers_page_enum" AS ENUM('landing', 'ios')`);
    await queryRunner.query(
      `CREATE TABLE "subscribers" ("id" SERIAL NOT NULL, "email" character varying, "phone_number" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "page" "public"."subscribers_page_enum" NOT NULL DEFAULT 'landing', CONSTRAINT "UQ_d996de14db5063937543786275a" UNIQUE ("phone_number"), CONSTRAINT "PK_cbe0a7a9256c826f403c0236b67" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "templates" ("id" SERIAL NOT NULL, "title" character varying, "heading" text, "description" text, "signature" text, "footer" text, "brand_id" integer NOT NULL, "content" jsonb NOT NULL, CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "media" ("id" SERIAL NOT NULL, "file_name" character varying NOT NULL, "url" character varying NOT NULL, "mime_type" character varying NOT NULL, "media_type" character varying NOT NULL, "related_type" character varying NOT NULL, "related_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f4e0fcac36e050de337b670d8bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contact_us" ("id" SERIAL NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "email" character varying NOT NULL, "your_question" character varying NOT NULL, CONSTRAINT "PK_b61766a4d93470109266b976cfe" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_captured_for_ios" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, CONSTRAINT "PK_9e7ba58c362e78846b31deb786c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "body_scan_log_count" ("id" SERIAL NOT NULL, "count" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f9bdf17a308cc2afdbb875ca4c6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`CREATE TYPE "public"."affiliate_status_enum" AS ENUM('in progress', 'completed')`);
    await queryRunner.query(
      `CREATE TABLE "affiliate" ("id" SERIAL NOT NULL, "affiliate_id" character varying NOT NULL, "status" "public"."affiliate_status_enum" NOT NULL DEFAULT 'in progress', "brand_id" integer, "influencer_id" integer, CONSTRAINT "UQ_f63020cf38274c59dcf92c58128" UNIQUE ("affiliate_id"), CONSTRAINT "PK_1ce9ae335b25b11224e2756cfdc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "affiliate_demo_products" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "body" text NOT NULL, "images" jsonb, "tags" character varying(255), "category" character varying(255), "style" character varying(255), "subcategory" character varying(255), "price" character varying(255), "affiliate_link" text, CONSTRAINT "PK_6a35accdab23a8db4336b863b49" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "social_integrations" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "social_integrations" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "social_integrations" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "social_integrations" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(
      `ALTER TABLE "exhibit_documents" ADD CONSTRAINT "FK_b9a5c49ae206e5defa932f85d69" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "exhibit_documents" ADD CONSTRAINT "FK_44ae3df11d22e1fe5853c643a74" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_comments" ADD CONSTRAINT "FK_8dd622162f3701990758593943a" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "FK_f26bf71f8e313b79d02a0df1b64" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_reviews" ADD CONSTRAINT "FK_adminreview_reviewer_influencer" FOREIGN KEY ("reviewer_id") REFERENCES "influencers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_reviews" ADD CONSTRAINT "FK_adminreview_reviewer_brand" FOREIGN KEY ("reviewer_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_reviews" ADD CONSTRAINT "FK_adminreview_reviewable_brand" FOREIGN KEY ("reviewable_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_reviews" ADD CONSTRAINT "FK_adminreview_reviewable_influencer" FOREIGN KEY ("reviewable_id") REFERENCES "influencers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "admin_reviews" ADD CONSTRAINT "FK_65c0d24fb20900bdd99eb95b222" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_users" ADD CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_users" ADD CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_9e5fc47ecb06d4d7b84633b1718" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "chat_messages" ADD CONSTRAINT "FK_9f5c0b96255734666b7b4bc98c3" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_sender_user" FOREIGN KEY ("sender_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_receiver_user" FOREIGN KEY ("receiver_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_campaign" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "notifications" ADD CONSTRAINT "fk_notifications_chat_id" FOREIGN KEY ("chat_id") REFERENCES "chats"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund_releases" ADD CONSTRAINT "fk_fund_release_campaign_payment" FOREIGN KEY ("campaign_payment_id") REFERENCES "campaign_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund_releases" ADD CONSTRAINT "fk_fund_release_influencer" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "fund_releases" ADD CONSTRAINT "fk_fund_release_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refunds" ADD CONSTRAINT "fk_refund_campaign_payment" FOREIGN KEY ("campaign_payment_id") REFERENCES "campaign_payments"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refunds" ADD CONSTRAINT "fk_refund_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_payments" ADD CONSTRAINT "fk_campaign_payments_campaign" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_payments" ADD CONSTRAINT "fk_campaign_payments_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_disputes" ADD CONSTRAINT "fk_campaign_disputes_campaign" FOREIGN KEY ("campaign_id") REFERENCES "campaigns"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_disputes" ADD CONSTRAINT "fk_campaign_disputes_user_raised_by" FOREIGN KEY ("raised_by_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaign_disputes" ADD CONSTRAINT "fk_campaign_disputes_user_against_id" FOREIGN KEY ("against_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD CONSTRAINT "FK_4d0f69a23f991dbd8fdc60a27bb" FOREIGN KEY ("segment_id") REFERENCES "segments"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD CONSTRAINT "FK_c579ff1f9a5657e1d45443e496d" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "campaigns" ADD CONSTRAINT "FK_cd8ba988ed1ce77f807c8f900c4" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "segments" ADD CONSTRAINT "FK_3dbbb4c2aa901ab7d45cff89ce7" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "oauth_credentials" ADD CONSTRAINT "fk_oauth_brand" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "brands" ADD CONSTRAINT "fk_brand_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_sizes" ADD CONSTRAINT "fk_productsize_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_sizes" ADD CONSTRAINT "fk_productsize_size" FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sub_categories" ADD CONSTRAINT "fk_category_subcategory" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "demographics" ADD CONSTRAINT "fk_demographics_influencer" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "demographics" ADD CONSTRAINT "fk_demographics_consumer" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_favourites" ADD CONSTRAINT "fk_postfavorite_consumer" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_favourites" ADD CONSTRAINT "fk_postfavorite_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "fk_cart_consumer" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cart" ADD CONSTRAINT "fk_cart_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "reviews" ADD CONSTRAINT "fk_reviews_consumer" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_visits" ADD CONSTRAINT "fk_post_visits_consumer" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_visits" ADD CONSTRAINT "fk_postVisit_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate_products" ADD CONSTRAINT "FK_0156867359b67f173da0bcc3e0a" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_affiliate_products" ADD CONSTRAINT "fk_favoriteaffiliate_consumer" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "favorite_affiliate_products" ADD CONSTRAINT "FK_766b703d1e85e44692eedfff29b" FOREIGN KEY ("affiliate_product_id") REFERENCES "affiliate_products"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "consumers" ADD CONSTRAINT "fk_consumer_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "consumers" ADD CONSTRAINT "fk_consumer_measurement" FOREIGN KEY ("measurement_id") REFERENCES "body_measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_favourites" ADD CONSTRAINT "fk_productfavorite_consumer" FOREIGN KEY ("consumer_id") REFERENCES "consumers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_favourites" ADD CONSTRAINT "fk_productfavorite_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_favourites" ADD CONSTRAINT "fk_productfavorite_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_favourites" ADD CONSTRAINT "fk_productfavorite_post_product" FOREIGN KEY ("post_product_id") REFERENCES "post_products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "fk_brand_product" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "fk_category_product" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "fk_sub_category_product" FOREIGN KEY ("sub_category_id") REFERENCES "sub_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "fk_review_product" FOREIGN KEY ("review_id") REFERENCES "reviews"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "fk_gender_product" FOREIGN KEY ("gender_id") REFERENCES "gender"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "fk_style_product" FOREIGN KEY ("style_id") REFERENCES "style"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_products" ADD CONSTRAINT "fk_postproduct_product" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_products" ADD CONSTRAINT "fk_postproduct_post" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "influencer_profiles" ADD CONSTRAINT "FK_8d9f8a6a8b27852d3e69e9a8e27" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "influencer_profiles" ADD CONSTRAINT "FK_6799046d48e16c4f3714c391efe" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "posts" ADD CONSTRAINT "FK_9816f1435304f7d2813810e3057" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "proposals" ADD CONSTRAINT "fk_proposal_influencer" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "instagram_stats" ADD CONSTRAINT "FK_194b04bb10318ce0aa71c88850d" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "stripe_connected_accounts" ADD CONSTRAINT "fk_influencer_stripe_connected_account_influencer" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "influencers" ADD CONSTRAINT "fk_influencer_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "influencers" ADD CONSTRAINT "fk_influencer_measurement" FOREIGN KEY ("measurement_id") REFERENCES "body_measurements"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "fk_follower_user" FOREIGN KEY ("follower_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "follows" ADD CONSTRAINT "fk_followee_user" FOREIGN KEY ("followee_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_integrations" ADD CONSTRAINT "fk_socialintegration_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD CONSTRAINT "fk_user_answers_questionnaire" FOREIGN KEY ("question_id") REFERENCES "questionnaires"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_answers" ADD CONSTRAINT "fk_user_answers_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ubu_subscriptions" ADD CONSTRAINT "fk_ubu_subscription_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tags" ADD CONSTRAINT "FK_74603743868d1e4f4fc2c0225b6" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_20ce3565a4dda1ce7a3e8104f2a" FOREIGN KEY ("blog_id") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_tags" ADD CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876" FOREIGN KEY ("tag_id") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blogs" ADD CONSTRAINT "fk_blogs_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "forgot_password_tokens" ADD CONSTRAINT "FK_779e5ebc693d8490cdf072f189a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "sessionlog" ADD CONSTRAINT "fk_user_id" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "whats_new" ADD CONSTRAINT "FK_737615c47ed8d49ef6d838da73e" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_errors" ADD CONSTRAINT "FK_e343bece3d77ea732bea2fbbc56" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "influencer_payments" ADD CONSTRAINT "fk_influencer_payout_payments" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_searches" ADD CONSTRAINT "fk_user_search_user" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "whats_new_seen_by" ADD CONSTRAINT "FK_fc6f4a55f3d80f39f061c2a889e" FOREIGN KEY ("whats_new_id") REFERENCES "whats_new"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "whats_new_seen_by" ADD CONSTRAINT "FK_dea0189478f060ffa47e170e88a" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "weekly_tracking_summaries" ADD CONSTRAINT "FK_dc960e43e931b98e3922b8c924b" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "weekly_tracking_summaries" ADD CONSTRAINT "FK_4c9031c4e0d764b9876bfa0b1bf" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "templates" ADD CONSTRAINT "FK_5365cfc29b825b00786c96dc926" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "social_integrations" ADD CONSTRAINT "FK_4b72b3d61c6baa6cc548556becb" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "FK_d6091d64f2ac9869e320228dadb" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "affiliate" ADD CONSTRAINT "FK_cd550037e35f16bb74f82fd99a9" FOREIGN KEY ("influencer_id") REFERENCES "influencers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "affiliate" DROP CONSTRAINT "FK_cd550037e35f16bb74f82fd99a9"`);
    await queryRunner.query(`ALTER TABLE "affiliate" DROP CONSTRAINT "FK_d6091d64f2ac9869e320228dadb"`);
    await queryRunner.query(`ALTER TABLE "social_integrations" DROP CONSTRAINT "FK_4b72b3d61c6baa6cc548556becb"`);
    await queryRunner.query(`ALTER TABLE "templates" DROP CONSTRAINT "FK_5365cfc29b825b00786c96dc926"`);
    await queryRunner.query(`ALTER TABLE "weekly_tracking_summaries" DROP CONSTRAINT "FK_4c9031c4e0d764b9876bfa0b1bf"`);
    await queryRunner.query(`ALTER TABLE "weekly_tracking_summaries" DROP CONSTRAINT "FK_dc960e43e931b98e3922b8c924b"`);
    await queryRunner.query(`ALTER TABLE "whats_new_seen_by" DROP CONSTRAINT "FK_dea0189478f060ffa47e170e88a"`);
    await queryRunner.query(`ALTER TABLE "whats_new_seen_by" DROP CONSTRAINT "FK_fc6f4a55f3d80f39f061c2a889e"`);
    await queryRunner.query(`ALTER TABLE "user_searches" DROP CONSTRAINT "fk_user_search_user"`);
    await queryRunner.query(`ALTER TABLE "influencer_payments" DROP CONSTRAINT "fk_influencer_payout_payments"`);
    await queryRunner.query(`ALTER TABLE "user_errors" DROP CONSTRAINT "FK_e343bece3d77ea732bea2fbbc56"`);
    await queryRunner.query(`ALTER TABLE "whats_new" DROP CONSTRAINT "FK_737615c47ed8d49ef6d838da73e"`);
    await queryRunner.query(`ALTER TABLE "sessionlog" DROP CONSTRAINT "fk_user_id"`);
    await queryRunner.query(`ALTER TABLE "forgot_password_tokens" DROP CONSTRAINT "FK_779e5ebc693d8490cdf072f189a"`);
    await queryRunner.query(`ALTER TABLE "blogs" DROP CONSTRAINT "fk_blogs_user"`);
    await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_7d8cc813269fa2a0ec3f8571876"`);
    await queryRunner.query(`ALTER TABLE "blog_tags" DROP CONSTRAINT "FK_20ce3565a4dda1ce7a3e8104f2a"`);
    await queryRunner.query(`ALTER TABLE "tags" DROP CONSTRAINT "FK_74603743868d1e4f4fc2c0225b6"`);
    await queryRunner.query(`ALTER TABLE "ubu_subscriptions" DROP CONSTRAINT "fk_ubu_subscription_user"`);
    await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "fk_user_answers_user"`);
    await queryRunner.query(`ALTER TABLE "user_answers" DROP CONSTRAINT "fk_user_answers_questionnaire"`);
    await queryRunner.query(`ALTER TABLE "social_integrations" DROP CONSTRAINT "fk_socialintegration_user"`);
    await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "fk_followee_user"`);
    await queryRunner.query(`ALTER TABLE "follows" DROP CONSTRAINT "fk_follower_user"`);
    await queryRunner.query(`ALTER TABLE "influencers" DROP CONSTRAINT "fk_influencer_measurement"`);
    await queryRunner.query(`ALTER TABLE "influencers" DROP CONSTRAINT "fk_influencer_user"`);
    await queryRunner.query(`ALTER TABLE "stripe_connected_accounts" DROP CONSTRAINT "fk_influencer_stripe_connected_account_influencer"`);
    await queryRunner.query(`ALTER TABLE "instagram_stats" DROP CONSTRAINT "FK_194b04bb10318ce0aa71c88850d"`);
    await queryRunner.query(`ALTER TABLE "proposals" DROP CONSTRAINT "fk_proposal_influencer"`);
    await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_9816f1435304f7d2813810e3057"`);
    await queryRunner.query(`ALTER TABLE "influencer_profiles" DROP CONSTRAINT "FK_6799046d48e16c4f3714c391efe"`);
    await queryRunner.query(`ALTER TABLE "influencer_profiles" DROP CONSTRAINT "FK_8d9f8a6a8b27852d3e69e9a8e27"`);
    await queryRunner.query(`ALTER TABLE "post_products" DROP CONSTRAINT "fk_postproduct_post"`);
    await queryRunner.query(`ALTER TABLE "post_products" DROP CONSTRAINT "fk_postproduct_product"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "fk_style_product"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "fk_gender_product"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "fk_review_product"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "fk_sub_category_product"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "fk_category_product"`);
    await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "fk_brand_product"`);
    await queryRunner.query(`ALTER TABLE "product_favourites" DROP CONSTRAINT "fk_productfavorite_post_product"`);
    await queryRunner.query(`ALTER TABLE "product_favourites" DROP CONSTRAINT "fk_productfavorite_post"`);
    await queryRunner.query(`ALTER TABLE "product_favourites" DROP CONSTRAINT "fk_productfavorite_product"`);
    await queryRunner.query(`ALTER TABLE "product_favourites" DROP CONSTRAINT "fk_productfavorite_consumer"`);
    await queryRunner.query(`ALTER TABLE "consumers" DROP CONSTRAINT "fk_consumer_measurement"`);
    await queryRunner.query(`ALTER TABLE "consumers" DROP CONSTRAINT "fk_consumer_user"`);
    await queryRunner.query(`ALTER TABLE "favorite_affiliate_products" DROP CONSTRAINT "FK_766b703d1e85e44692eedfff29b"`);
    await queryRunner.query(`ALTER TABLE "favorite_affiliate_products" DROP CONSTRAINT "fk_favoriteaffiliate_consumer"`);
    await queryRunner.query(`ALTER TABLE "affiliate_products" DROP CONSTRAINT "FK_0156867359b67f173da0bcc3e0a"`);
    await queryRunner.query(`ALTER TABLE "post_visits" DROP CONSTRAINT "fk_postVisit_post"`);
    await queryRunner.query(`ALTER TABLE "post_visits" DROP CONSTRAINT "fk_post_visits_consumer"`);
    await queryRunner.query(`ALTER TABLE "reviews" DROP CONSTRAINT "fk_reviews_consumer"`);
    await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "fk_cart_product"`);
    await queryRunner.query(`ALTER TABLE "cart" DROP CONSTRAINT "fk_cart_consumer"`);
    await queryRunner.query(`ALTER TABLE "post_favourites" DROP CONSTRAINT "fk_postfavorite_post"`);
    await queryRunner.query(`ALTER TABLE "post_favourites" DROP CONSTRAINT "fk_postfavorite_consumer"`);
    await queryRunner.query(`ALTER TABLE "demographics" DROP CONSTRAINT "fk_demographics_consumer"`);
    await queryRunner.query(`ALTER TABLE "demographics" DROP CONSTRAINT "fk_demographics_influencer"`);
    await queryRunner.query(`ALTER TABLE "sub_categories" DROP CONSTRAINT "fk_category_subcategory"`);
    await queryRunner.query(`ALTER TABLE "product_sizes" DROP CONSTRAINT "fk_productsize_size"`);
    await queryRunner.query(`ALTER TABLE "product_sizes" DROP CONSTRAINT "fk_productsize_product"`);
    await queryRunner.query(`ALTER TABLE "brands" DROP CONSTRAINT "fk_brand_user"`);
    await queryRunner.query(`ALTER TABLE "oauth_credentials" DROP CONSTRAINT "fk_oauth_brand"`);
    await queryRunner.query(`ALTER TABLE "segments" DROP CONSTRAINT "FK_3dbbb4c2aa901ab7d45cff89ce7"`);
    await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_cd8ba988ed1ce77f807c8f900c4"`);
    await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_c579ff1f9a5657e1d45443e496d"`);
    await queryRunner.query(`ALTER TABLE "campaigns" DROP CONSTRAINT "FK_4d0f69a23f991dbd8fdc60a27bb"`);
    await queryRunner.query(`ALTER TABLE "campaign_disputes" DROP CONSTRAINT "fk_campaign_disputes_user_against_id"`);
    await queryRunner.query(`ALTER TABLE "campaign_disputes" DROP CONSTRAINT "fk_campaign_disputes_user_raised_by"`);
    await queryRunner.query(`ALTER TABLE "campaign_disputes" DROP CONSTRAINT "fk_campaign_disputes_campaign"`);
    await queryRunner.query(`ALTER TABLE "campaign_payments" DROP CONSTRAINT "fk_campaign_payments_user"`);
    await queryRunner.query(`ALTER TABLE "campaign_payments" DROP CONSTRAINT "fk_campaign_payments_campaign"`);
    await queryRunner.query(`ALTER TABLE "refunds" DROP CONSTRAINT "fk_refund_user"`);
    await queryRunner.query(`ALTER TABLE "refunds" DROP CONSTRAINT "fk_refund_campaign_payment"`);
    await queryRunner.query(`ALTER TABLE "fund_releases" DROP CONSTRAINT "fk_fund_release_user"`);
    await queryRunner.query(`ALTER TABLE "fund_releases" DROP CONSTRAINT "fk_fund_release_influencer"`);
    await queryRunner.query(`ALTER TABLE "fund_releases" DROP CONSTRAINT "fk_fund_release_campaign_payment"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "fk_notifications_chat_id"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "fk_notifications_campaign"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "fk_notifications_receiver_user"`);
    await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "fk_notifications_sender_user"`);
    await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_9f5c0b96255734666b7b4bc98c3"`);
    await queryRunner.query(`ALTER TABLE "chat_messages" DROP CONSTRAINT "FK_9e5fc47ecb06d4d7b84633b1718"`);
    await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_f60265ed6da63600bad2c5ee8c4"`);
    await queryRunner.query(`ALTER TABLE "chat_users" DROP CONSTRAINT "FK_9a5f2493e2c02490ceb527649e4"`);
    await queryRunner.query(`ALTER TABLE "admin_reviews" DROP CONSTRAINT "FK_65c0d24fb20900bdd99eb95b222"`);
    await queryRunner.query(`ALTER TABLE "admin_reviews" DROP CONSTRAINT "FK_adminreview_reviewable_influencer"`);
    await queryRunner.query(`ALTER TABLE "admin_reviews" DROP CONSTRAINT "FK_adminreview_reviewable_brand"`);
    await queryRunner.query(`ALTER TABLE "admin_reviews" DROP CONSTRAINT "FK_adminreview_reviewer_brand"`);
    await queryRunner.query(`ALTER TABLE "admin_reviews" DROP CONSTRAINT "FK_adminreview_reviewer_influencer"`);
    await queryRunner.query(`ALTER TABLE "contracts" DROP CONSTRAINT "FK_f26bf71f8e313b79d02a0df1b64"`);
    await queryRunner.query(`ALTER TABLE "campaign_comments" DROP CONSTRAINT "FK_8dd622162f3701990758593943a"`);
    await queryRunner.query(`ALTER TABLE "exhibit_documents" DROP CONSTRAINT "FK_44ae3df11d22e1fe5853c643a74"`);
    await queryRunner.query(`ALTER TABLE "exhibit_documents" DROP CONSTRAINT "FK_b9a5c49ae206e5defa932f85d69"`);
    await queryRunner.query(`ALTER TABLE "social_integrations" DROP COLUMN "updated_at"`);
    await queryRunner.query(`ALTER TABLE "social_integrations" DROP COLUMN "created_at"`);
    await queryRunner.query(`ALTER TABLE "social_integrations" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "social_integrations" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`DROP TABLE "affiliate_demo_products"`);
    await queryRunner.query(`DROP TABLE "affiliate"`);
    await queryRunner.query(`DROP TYPE "public"."affiliate_status_enum"`);
    await queryRunner.query(`DROP TABLE "body_scan_log_count"`);
    await queryRunner.query(`DROP TABLE "email_captured_for_ios"`);
    await queryRunner.query(`DROP TABLE "contact_us"`);
    await queryRunner.query(`DROP TABLE "media"`);
    await queryRunner.query(`DROP TABLE "templates"`);
    await queryRunner.query(`DROP TABLE "subscribers"`);
    await queryRunner.query(`DROP TYPE "public"."subscribers_page_enum"`);
    await queryRunner.query(`DROP TABLE "weekly_tracking_summaries"`);
    await queryRunner.query(`DROP TABLE "whats_new_seen_by"`);
    await queryRunner.query(`DROP INDEX "public"."index_user_email"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TYPE "public"."user_sign_in_method_enum"`);
    await queryRunner.query(`DROP TABLE "user_searches"`);
    await queryRunner.query(`DROP TABLE "influencer_payments"`);
    await queryRunner.query(`DROP TYPE "public"."influencer_payments_status_enum"`);
    await queryRunner.query(`DROP TABLE "user_errors"`);
    await queryRunner.query(`DROP TABLE "whats_new"`);
    await queryRunner.query(`DROP TABLE "sessionlog"`);
    await queryRunner.query(`DROP TABLE "forgot_password_tokens"`);
    await queryRunner.query(`DROP TABLE "blogs"`);
    await queryRunner.query(`DROP TABLE "blog_tags"`);
    await queryRunner.query(`DROP TABLE "tags"`);
    await queryRunner.query(`DROP TABLE "ubu_subscriptions"`);
    await queryRunner.query(`DROP TYPE "public"."ubu_subscriptions_plan_type_enum"`);
    await queryRunner.query(`DROP TABLE "user_answers"`);
    await queryRunner.query(`DROP TABLE "questionnaires"`);
    await queryRunner.query(`DROP TYPE "public"."questionnaires_layout_enum"`);
    await queryRunner.query(`DROP TYPE "public"."questionnaires_user_type_enum"`);
    await queryRunner.query(`DROP TABLE "social_integrations"`);
    await queryRunner.query(`DROP TABLE "follows"`);
    await queryRunner.query(`DROP TABLE "influencers"`);
    await queryRunner.query(`DROP TABLE "stripe_connected_accounts"`);
    await queryRunner.query(`DROP TYPE "public"."stripe_connected_accounts_status_enum"`);
    await queryRunner.query(`DROP TABLE "instagram_stats"`);
    await queryRunner.query(`DROP TABLE "proposals"`);
    await queryRunner.query(`DROP TYPE "public"."proposals_status_enum"`);
    await queryRunner.query(`DROP TABLE "posts"`);
    await queryRunner.query(`DROP TABLE "influencer_profiles"`);
    await queryRunner.query(`DROP TABLE "post_products"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "style"`);
    await queryRunner.query(`DROP TABLE "product_favourites"`);
    await queryRunner.query(`DROP TABLE "consumers"`);
    await queryRunner.query(`DROP TABLE "favorite_affiliate_products"`);
    await queryRunner.query(`DROP TABLE "affiliate_products"`);
    await queryRunner.query(`DROP TABLE "post_visits"`);
    await queryRunner.query(`DROP TABLE "reviews"`);
    await queryRunner.query(`DROP TABLE "cart"`);
    await queryRunner.query(`DROP TABLE "post_favourites"`);
    await queryRunner.query(`DROP TABLE "demographics"`);
    await queryRunner.query(`DROP TABLE "body_measurements"`);
    await queryRunner.query(`DROP TABLE "gender"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "sub_categories"`);
    await queryRunner.query(`DROP TABLE "product_sizes"`);
    await queryRunner.query(`DROP TABLE "sizes"`);
    await queryRunner.query(`DROP TABLE "brands"`);
    await queryRunner.query(`DROP TABLE "oauth_credentials"`);
    await queryRunner.query(`DROP TYPE "public"."oauth_credentials_creds_type_enum"`);
    await queryRunner.query(`DROP TABLE "segments"`);
    await queryRunner.query(`DROP TABLE "campaigns"`);
    await queryRunner.query(`DROP TYPE "public"."campaigns_status_enum"`);
    await queryRunner.query(`DROP TABLE "campaign_disputes"`);
    await queryRunner.query(`DROP TYPE "public"."campaign_disputes_resolution_action_enum"`);
    await queryRunner.query(`DROP TYPE "public"."campaign_disputes_campaign_last_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."campaign_disputes_status_enum"`);
    await queryRunner.query(`DROP TABLE "campaign_payments"`);
    await queryRunner.query(`DROP TYPE "public"."campaign_payments_status_enum"`);
    await queryRunner.query(`DROP TABLE "refunds"`);
    await queryRunner.query(`DROP TYPE "public"."refunds_status_enum"`);
    await queryRunner.query(`DROP TABLE "fund_releases"`);
    await queryRunner.query(`DROP TYPE "public"."fund_releases_status_enum"`);
    await queryRunner.query(`DROP TABLE "notifications"`);
    await queryRunner.query(`DROP TABLE "chat_messages"`);
    await queryRunner.query(`DROP TABLE "chats"`);
    await queryRunner.query(`DROP TABLE "chat_users"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_admin_reviews_reviewer_type"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_admin_reviews_reviewable_type"`);
    await queryRunner.query(`DROP TABLE "admin_reviews"`);
    await queryRunner.query(`DROP TABLE "contracts"`);
    await queryRunner.query(`DROP TABLE "campaign_comments"`);
    await queryRunner.query(`DROP TABLE "exhibit_documents"`);
  }
}
