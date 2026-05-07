const Affiliate = require('../models/Affiliate');
const User = require('../models/User');
const Campaign = require('../models/Campaign');
const Payout = require('../models/Payout');
const Commission = require('../models/Commission');
const crypto = require('crypto');
const { createNotification } = require('./notificationController');

const Conversion = require('../models/Conversion');
const Click = require('../models/Click');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalClicks = await Click.countDocuments();
    const approvedConversions = await Conversion.find({ status: 'approved' });
    
    const totalRevenue = approvedConversions.reduce((sum, c) => sum + c.revenue, 0);
    const totalConversions = approvedConversions.length;

    // Total Affiliate Revenue (Commissions)
    const commissions = await Commission.find({ status: { $in: ['approved', 'paid'] } });
    const totalAffiliateRevenue = commissions.reduce((sum, c) => sum + c.amount, 0);

    const activePartners = await Affiliate.countDocuments({ status: 'approved' });

    // Top Affiliates Leaderboard
    const topAffiliates = await Commission.aggregate([
      { $match: { status: { $in: ['approved', 'paid'] } } },
      { $group: { _id: '$affiliate_id', total_earned: { $sum: '$amount' } } },
      { $sort: { total_earned: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'affiliates', localField: '_id', foreignField: '_id', as: 'affiliate' } },
      { $unwind: '$affiliate' },
      { $lookup: { from: 'users', localField: 'affiliate.user_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' }
    ]);

    // Campaign Performance
    const campaignPerformance = await Conversion.aggregate([
      { $match: { status: 'approved' } },
      { $group: { _id: '$campaign_id', revenue: { $sum: '$revenue' }, count: { $sum: 1 } } },
      { $lookup: { from: 'campaigns', localField: '_id', foreignField: '_id', as: 'campaign' } },
      { $unwind: '$campaign' }
    ]);

    // ROI Tracking (Net Profit / Affiliate Cost)
    const netProfit = totalRevenue - totalAffiliateRevenue;
    const roi = totalAffiliateRevenue > 0 ? ((netProfit / totalAffiliateRevenue) * 100).toFixed(2) : 0;

    res.json({
      totalClicks,
      totalConversions,
      totalRevenue,
      totalAffiliateRevenue,
      netProfit,
      roi,
      activePartners,
      topAffiliates: topAffiliates.map(a => ({
        id: a._id,
        name: a.user.name,
        earnings: a.total_earned
      })),
      campaignPerformance: campaignPerformance.map(cp => ({
        id: cp._id,
        name: cp.campaign.name,
        revenue: cp.revenue,
        conversions: cp.count
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCampaign = async (req, res) => {
  try {
    const { name, product_name, commission_type, commission_value, cookie_duration } = req.body;
    const campaign = await Campaign.create({ name, product_name, commission_type, commission_value, cookie_duration });
    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllAffiliates = async (req, res) => {
  try {
    const affiliates = await Affiliate.find().populate('user_id', 'name email mobile role');
    res.json(affiliates);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAffiliateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const affiliate = await Affiliate.findById(id).populate('user_id', 'name');
    if (!affiliate) return res.status(404).json({ error: 'Affiliate not found' });

    affiliate.status = status;

    // Auto-generate affiliate code if approved and not already set
    if (status === 'approved' && !affiliate.affiliate_code) {
      const namePrefix = affiliate.user_id.name.split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
      const randomSuffix = Math.floor(100 + Math.random() * 900);
      affiliate.affiliate_code = `${namePrefix}${randomSuffix}`;
    }

    await affiliate.save();

    // Send Notification
    await createNotification(
      affiliate.user_id._id,
      `Your affiliate account status has been updated to: ${status.toUpperCase()}`,
      status === 'approved' ? 'success' : 'warning'
    );

    res.json({ message: `Affiliate status updated to ${status}`, affiliate });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllPayouts = async (req, res) => {
  try {
    const payouts = await Payout.find()
      .populate({
        path: 'affiliate_id',
        populate: { path: 'user_id', select: 'name email' }
      })
      .sort({ requested_at: -1 });
    res.json(payouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePayoutStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const Settings = require('../models/Settings');
    const settings = await Settings.findOne() || { tds_rate: 5 };
    
    const payout = await Payout.findById(id).populate('affiliate_id');
    if (!payout) return res.status(404).json({ error: 'Payout not found' });
    
    payout.status = status;
    if (status === 'paid') {
      const tdsAmount = (payout.amount * (settings.tds_rate / 100));
      payout.paid_at = new Date();
      payout.tds_deducted = tdsAmount;
      payout.final_amount = payout.amount - tdsAmount;
    }
    
    await payout.save();
    res.json({ message: `Payout status updated to ${status}. TDS of ₹${payout.tds_deducted || 0} deducted.`, payout });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getAllConversions = async (req, res) => {
  try {
    const conversions = await Conversion.find()
      .populate('affiliate_id')
      .populate('campaign_id')
      .sort({ created_at: -1 });
    res.json(conversions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateConversionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const conversion = await Conversion.findById(id);
    if (!conversion) return res.status(404).json({ error: 'Conversion not found' });
    
    conversion.status = status;
    await conversion.save();

    // Sync with Commission
    await Commission.updateMany({ conversion_id: id }, { status });

    res.json({ message: `Conversion status updated to ${status}`, conversion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
