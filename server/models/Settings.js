const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  min_payout_threshold: { type: Number, default: 500 },
  default_cookie_duration: { type: Number, default: 30 },
  tds_rate: { type: Number, default: 5 }, // 5% TDS for India
  platform_name: { type: String, default: 'AffiliatePro' },
  support_email: String,
  currency: { type: String, default: 'INR' }
}, { timestamps: true });

module.exports = mongoose.model('Settings', settingsSchema);
