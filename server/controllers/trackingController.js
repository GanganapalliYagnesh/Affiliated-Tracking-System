const Affiliate = require('../models/Affiliate');
const Campaign = require('../models/Campaign');
const Click = require('../models/Click');
const FraudLog = require('../models/FraudLog');
const AffiliateCampaign = require('../models/AffiliateCampaign');
const crypto = require('crypto');

const FRONTEND_URL = process.env.FRONTEND_URL || '${FRONTEND_URL}';

exports.trackClick = async (req, res) => {
  try {
    const { ref, campaign: campaignId, s: shortCode } = req.query;
    const userAgent = req.get('User-Agent') || '';
    const ipAddress = req.ip;

    // 1. Bot Detection
    const botPatterns = /bot|spider|crawl|slurp|bingbot|googlebot|lighthouse|headless/i;
    if (botPatterns.test(userAgent)) {
      await FraudLog.create({ reason: `Bot detected: ${userAgent}` });
      return res.redirect('${FRONTEND_URL}/shop'); // Silent redirect
    }

    // 2. Resolve Affiliate and Campaign
    let affiliate, campaign;
    if (shortCode) {
      const mapping = await AffiliateCampaign.findOne({ short_code: shortCode }).populate('affiliate_id campaign_id');
      if (mapping) {
        affiliate = mapping.affiliate_id;
        campaign = mapping.campaign_id;
      }
    } else {
      affiliate = await Affiliate.findOne({ affiliate_code: ref });
      campaign = await Campaign.findById(campaignId);
    }

    if (!affiliate || !campaign) {
      return res.status(404).send('Invalid tracking link');
    }

    // 3. Duplicate Click / IP Filtering (1 hour window)
    const recentClick = await Click.findOne({
      ip_address: ipAddress,
      campaign_id: campaign._id,
      created_at: { $gt: new Date(Date.now() - 60 * 60 * 1000) }
    });

    if (recentClick) {
      // Still redirect to keep UX smooth, but don't log a new click
      return res.redirect(`${FRONTEND_URL}/shop?product=${encodeURIComponent(campaign.product_name)}&clickId=${recentClick.click_id}&dup=1`);
    }

    // 4. Smart Attribution (Cross-Device / Persistent ID)
    const persistentId = req.cookies?.aff_uid;
    if (persistentId) {
      console.log(`[SmartAttrib] Re-identified user across device via ID: ${persistentId}`);
    }

    // 5. Self-Referral Blocking
    if (req.cookies?.aff_id === affiliate._id.toString()) {
      affiliate.trust_score = Math.max(0, affiliate.trust_score - 10);
      await affiliate.save();
      await FraudLog.create({ 
        affiliate_id: affiliate._id, 
        reason: 'Self-referral attempt - AI Trust Score Decremented' 
      });
    }

    // 5. Attribution Logic (First-Click vs Last-Click)
    const existingClickId = req.cookies?.aff_click_id;
    if (existingClickId && campaign.attribution_model === 'first-click') {
      return res.redirect(`${FRONTEND_URL}/shop?product=${encodeURIComponent(campaign.product_name)}&clickId=${existingClickId}`);
    }

    // 6. Device Fingerprinting
    const fingerprint = {
      ua: userAgent,
      platform: req.get('sec-ch-ua-platform') || 'Unknown',
      mobile: req.get('sec-ch-ua-mobile') === '?1',
      lang: req.get('Accept-Language'),
      ip: ipAddress
    };

    const clickId = crypto.randomBytes(16).toString('hex');
    const eventQueue = require('../utils/eventQueue');

    // Offload to background queue for scalability
    eventQueue.addClick({
      affiliate_id: affiliate._id,
      campaign_id: campaign._id,
      click_id: clickId,
      ip_address: ipAddress,
      user_agent: userAgent,
      device_info: JSON.stringify(fingerprint),
      referrer: req.get('Referer')
    });

    // 7. Cookie Tracking
    const cookieMaxAge = (campaign.cookie_duration || 30) * 24 * 60 * 60 * 1000;
    res.cookie('aff_click_id', clickId, { maxAge: cookieMaxAge, httpOnly: true, sameSite: 'Lax' });
    res.cookie('aff_id', affiliate._id.toString(), { maxAge: cookieMaxAge, httpOnly: true, sameSite: 'Lax' });

    res.redirect(`${FRONTEND_URL}/shop?product=${encodeURIComponent(campaign.product_name)}&clickId=${clickId}`);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.trackCoupon = async (req, res) => {
  try {
    const { couponCode } = req.body;
    const mapping = await AffiliateCampaign.findOne({ coupon_code: couponCode }).populate('affiliate_id campaign_id');

    if (!mapping) {
      return res.status(404).json({ error: 'Invalid coupon code' });
    }

    // Simulate a click for coupon attribution
    const clickId = crypto.randomBytes(16).toString('hex');
    await Click.create({
      affiliate_id: mapping.affiliate_id._id,
      campaign_id: mapping.campaign_id._id,
      click_id: clickId,
      coupon_code: couponCode,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    });

    res.json({ 
      success: true, 
      affiliate_id: mapping.affiliate_id._id,
      campaign_id: mapping.campaign_id._id,
      click_id: clickId,
      discount: '10%' // Mock discount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
