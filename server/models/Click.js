const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
  click_id: { type: String, required: true, unique: true }, // UUID
  affiliate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  ip_address: String,
  device_info: String,
  user_agent: String,
  coupon_code: String,
  click_timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Click', clickSchema);
