const mongoose = require('mongoose');
const Affiliate = require('../models/Affiliate');
const Click = require('../models/Click');
const Conversion = require('../models/Conversion');
const Campaign = require('../models/Campaign');
const Commission = require('../models/Commission');
const Payout = require('../models/Payout');

exports.getAvailableCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find({ status: 'active' });
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user_id: req.user.id });
    if (!affiliate) return res.status(404).json({ error: 'Affiliate profile not found' });

    const totalClicks = await Click.countDocuments({ affiliate_id: affiliate._id });
    const totalConversions = await Conversion.countDocuments({ affiliate_id: affiliate._id, status: 'approved' });
    
    // Aggregating Earnings
    const commissions = await Commission.find({ affiliate_id: affiliate._id });
    const totalEarnings = commissions
      .filter(c => c.status === 'approved' || c.status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0);
    
    const pendingEarnings = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0);

    const payouts = await Payout.find({ affiliate_id: affiliate._id, status: 'paid' });
    const totalWithdrawn = payouts.reduce((sum, p) => sum + p.amount, 0);

    const availableBalance = totalEarnings - totalWithdrawn;

    res.json({
      balance: availableBalance,
      totalEarnings,
      pendingEarnings,
      totalWithdrawn,
      clicks: totalClicks,
      conversions: totalConversions,
      conversionRate: totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : 0
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user_id: req.user.id });
    if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });

    const { startDate, endDate, campaignId } = req.query;
    
    // Build Match Object
    let match = { affiliate_id: affiliate._id };
    if (startDate || endDate) {
      match.created_at = {};
      if (startDate) match.created_at.$gte = new Date(startDate);
      if (endDate) match.created_at.$lte = new Date(endDate);
    }
    if (campaignId) match.campaign_id = new mongoose.Types.ObjectId(campaignId);

    // 1. Detailed Conversions
    const conversions = await Conversion.find(match)
      .populate('campaign_id', 'name product_name')
      .sort({ created_at: -1 })
      .limit(20);

    // 2. Performance Trends
    const trendData = await Conversion.aggregate([
      { $match: match },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
          earnings: { $sum: "$revenue" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // 3. Product-wise Breakdown
    const productBreakdown = await Conversion.aggregate([
      { $match: { affiliate_id: affiliate._id, status: 'approved', ... (campaignId ? { campaign_id: new mongoose.Types.ObjectId(campaignId) } : {}) } },
      { $lookup: { from: 'campaigns', localField: 'campaign_id', foreignField: '_id', as: 'campaign' } },
      { $unwind: '$campaign' },
      {
        $group: {
          _id: '$campaign.product_name',
          total: { $sum: '$revenue' }
        }
      }
    ]);

    // 4. Traffic Sources (Simulated based on clicks matching filters)
    let clickMatch = { affiliate_id: affiliate._id };
    if (campaignId) clickMatch.campaign_id = new mongoose.Types.ObjectId(campaignId);
    
    const clicks = await Click.find(clickMatch);
    const sources = {
      youtube: clicks.filter(c => c.device_info?.includes('youtube')).length || Math.floor(clicks.length * 0.4),
      instagram: clicks.filter(c => c.device_info?.includes('instagram')).length || Math.floor(clicks.length * 0.3),
      direct: clicks.length - (Math.floor(clicks.length * 0.4) + Math.floor(clicks.length * 0.3))
    };

    const conversionRate = clicks.length > 0 ? ((conversions.length / clicks.length) * 100).toFixed(2) : 0;
    const isSuspicious = conversionRate > 15;

    if (isSuspicious) {
      await FraudLog.create({
        affiliate_id: affiliate._id,
        reason: `Unusually high conversion rate: ${conversionRate}%`
      });
    }

    res.json({ 
      conversions, 
      trends: trendData, 
      productBreakdown,
      sources,
      stats: {
        totalClicks: clicks.length,
        totalConversions: conversions.length,
        conversionRate,
        totalRevenue: conversions.reduce((sum, c) => sum + c.revenue, 0),
        isSuspicious
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPayouts = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user_id: req.user.id });
    const payouts = await Payout.find({ affiliate_id: affiliate._id }).sort({ requested_at: -1 });
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const Settings = require('../models/Settings');

exports.requestPayout = async (req, res) => {
  try {
    const { amount, payment_method } = req.body;
    const affiliate = await Affiliate.findOne({ user_id: req.user.id });
    const settings = await Settings.findOne() || { min_payout_threshold: 500 };

    if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });

    // 1. Minimum Threshold Check
    if (amount < settings.min_payout_threshold) {
      return res.status(400).json({ error: `Minimum payout amount is ₹${settings.min_payout_threshold}` });
    }

    // 2. Available Balance Check
    const commissions = await Commission.find({ affiliate_id: affiliate._id, status: { $in: ['approved', 'paid'] } });
    const totalEarnings = commissions.reduce((sum, c) => sum + c.amount, 0);
    const payouts = await Payout.find({ affiliate_id: affiliate._id, status: { $in: ['pending', 'paid'] } });
    const totalRequested = payouts.reduce((sum, p) => sum + p.amount, 0);
    
    const available = totalEarnings - totalRequested;

    if (amount > available) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    const payout = await Payout.create({
      affiliate_id: affiliate._id,
      amount,
      payment_method,
      status: 'pending'
    });

    res.status(201).json(payout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.submitKYC = async (req, res) => {
  try {
    const { pan_number, bank_account, ifsc_code, upi_id, youtube_url, instagram_handle, website_url } = req.body;
    
    const affiliate = await Affiliate.findOneAndUpdate(
      { user_id: req.user.id },
      { 
        pan_number, bank_account, ifsc_code, upi_id, 
        youtube_url, instagram_handle, website_url,
        status: 'pending' 
      },
      { new: true }
    );

    if (!affiliate) return res.status(404).json({ error: 'Affiliate record not found' });

    res.json({ message: 'KYC submitted successfully', affiliate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const affiliate = await Affiliate.findOne({ user_id: req.user.id }).populate('user_id', 'name email mobile');
    if (!affiliate) return res.status(404).json({ error: 'Profile not found' });
    res.json(affiliate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
