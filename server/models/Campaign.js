const mongoose = require('mongoose');

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  product_name: { type: String, required: true },
  commission_type: { type: String, enum: ['percentage', 'flat'], required: true },
  commission_value: { type: Number, required: true },
  cookie_duration: { type: Number, enum: [30, 60, 90], default: 30 },
  attribution_model: { type: String, enum: ['last-click', 'first-click', 'multi-touch'], default: 'last-click' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  image_url: String,
  description: String
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Campaign', campaignSchema);
