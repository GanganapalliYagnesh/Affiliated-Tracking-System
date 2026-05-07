const mongoose = require('mongoose');

const conversionSchema = new mongoose.Schema({
  click_id: { type: String, required: true },
  order_id: { type: String, required: true, unique: true },
  affiliate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  campaign_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  revenue: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Conversion', conversionSchema);
