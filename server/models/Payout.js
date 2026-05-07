const mongoose = require('mongoose');

const payoutSchema = new mongoose.Schema({
  affiliate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  amount: { type: Number, required: true },
  payment_method: { type: String, enum: ['upi', 'bank'], required: true },
  status: { type: String, enum: ['pending', 'approved', 'paid'], default: 'pending' },
  requested_at: { type: Date, default: Date.now },
  paid_at: Date,
  tds_deducted: { type: Number, default: 0 },
  final_amount: Number
}, { timestamps: { updatedAt: 'updated_at' } });

module.exports = mongoose.model('Payout', payoutSchema);
