const mongoose = require('mongoose');

const affiliateCampaignSchema = new mongoose.Schema({
  affiliate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  coupon_code: { type: String, unique: true, sparse: true },
  short_code: { type: String, unique: true, sparse: true },
  assigned_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AffiliateCampaign', affiliateCampaignSchema);
