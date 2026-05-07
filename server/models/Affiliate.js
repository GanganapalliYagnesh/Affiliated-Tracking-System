const mongoose = require('mongoose');

const affiliateSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  affiliate_code: { type: String, unique: true }, // Auto-generated after approval
  status: { 
    type: String, 
    enum: ['pending', 'approved', 'rejected', 'suspended', 'blacklisted'], 
    default: 'pending' 
  },
  pan_number: String,
  bank_account: String,
  ifsc_code: String,
  upi_id: String,
  youtube_url: String,
  instagram_handle: String,
  website_url: String,
  parent_affiliate: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate' }, // For multi-level system
  trust_score: { type: Number, default: 100 }, // For AI fraud detection
  total_earnings: { type: Number, default: 0 },
  available_balance: { type: Number, default: 0 }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Affiliate', affiliateSchema);
