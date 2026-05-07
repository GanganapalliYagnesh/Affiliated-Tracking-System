const mongoose = require('mongoose');

const commissionSchema = new mongoose.Schema({
  affiliate_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Affiliate', required: true },
  conversion_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversion', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'paid'], default: 'pending' },
  hold_until: Date // Cool-off period
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

module.exports = mongoose.model('Commission', commissionSchema);
