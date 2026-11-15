// src/common/constants/dispute-select-fields.ts

export const DISPUTE_SELECT_FIELDS = Object.freeze({
  id: true,
  is_refund_requested: true,
  status: true,
  admin_remarks: true,
  influencer_concerns: true,
  brand_concerns: true,
  resolution_action: true,
  created_at: true,
  raised_by: {
    id: true,
    first_name: true,
    last_name: true,
    email: true,
    is_brand: true,
    is_influencer: true,
    is_consumer: true,
  },
  against_by: {
    id: true,
    first_name: true,
    last_name: true,
    email: true,
    is_brand: true,
    is_influencer: true,
    is_consumer: true,
  },
});
