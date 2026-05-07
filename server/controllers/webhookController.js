const Click = require('../models/Click');
const Conversion = require('../models/Conversion');
const Commission = require('../models/Commission');
const Campaign = require('../models/Campaign');
const Affiliate = require('../models/Affiliate');
const FraudLog = require('../models/FraudLog');
const { createNotification } = require('./notificationController');

exports.handleConversion = async (req, res) => {
  try {
    const { clickId, orderId, revenue, customerEmail } = req.body;

    const click = await Click.findOne({ click_id: clickId });
    if (!click) return res.status(404).json({ error: 'Click ID not found' });

    const campaign = await Campaign.findById(click.campaign_id);
    const affiliate = await Affiliate.findById(click.affiliate_id).populate('user_id', 'email');

    // 3. Self-Referral Detection
    if (customerEmail === affiliate.user_id.email) {
      await FraudLog.create({ 
        affiliate_id: affiliate._id, 
        click_id: clickId, 
        reason: 'Self-referral detected (same email)' 
      });
      return res.status(403).json({ error: 'Self-referrals are not allowed' });
    }

    // Record the conversion
    const conversion = await Conversion.create({
      click_id: clickId,
      order_id: orderId,
      affiliate_id: affiliate._id,
      campaign_id: campaign._id,
      revenue: revenue,
      status: 'pending'
    });

    // Calculate Commission
    let commissionAmount = 0;
    if (campaign.commission_type === 'percentage') {
      commissionAmount = (revenue * campaign.commission_value) / 100;
    } else {
      commissionAmount = campaign.commission_value;
    }

    // Create Commission Entry
    await Commission.create({
      affiliate_id: affiliate._id,
      conversion_id: conversion._id,
      amount: commissionAmount,
      status: 'pending',
      hold_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });

    // 4. Multi-Level Affiliate System (Tier 2 Commission)
    if (affiliate.parent_affiliate) {
      const parentCommission = revenue * 0.05; // 5% tier-2 commission
      await Commission.create({
        affiliate_id: affiliate.parent_affiliate,
        conversion_id: conversion._id,
        amount: parentCommission,
        status: 'pending',
        reason: 'Referral override (Tier 2)'
      });
    }

    // 5. AI Fraud Detection - Reward valid conversions with trust score
    affiliate.trust_score = Math.min(100, affiliate.trust_score + 1);
    await affiliate.save();

    // Send Notification
    await createNotification(
      affiliate.user_id,
      `New Conversion recorded! Order #${orderId} earned you ₹${commissionAmount.toFixed(2)}`,
      'success'
    );

    res.status(201).json({ message: 'Conversion recorded and commission assigned' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
