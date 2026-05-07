const mongoose = require('mongoose');

const fraudLogSchema = new mongoose.Schema({
  affiliate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate' },
  click_id: String,
  reason: { type: String, required: true },
  flagged_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FraudLog', fraudLogSchema);
