const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Affiliate = require('../server/models/Affiliate');
const Campaign = require('../server/models/Campaign');
const Conversion = require('../server/models/Conversion');
const Click = require('../server/models/Click');
const User = require('../server/models/User');

async function seedData() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Find the Google User
    const googleUser = await User.findOne({ email: 'google@example.com' });
    if (!googleUser) {
      console.log('Google user not found. Please login with Google first.');
      process.exit(1);
    }

    const affiliate = await Affiliate.findOne({ user_id: googleUser._id });
    const campaigns = await Campaign.find({ status: 'active' });

    if (!affiliate || campaigns.length === 0) {
      console.log('Affiliate or campaigns not found.');
      process.exit(1);
    }

    // Add Clicks
    for (let i = 0; i < 20; i++) {
      const camp = campaigns[i % campaigns.length];
      await Click.create({
        affiliate_id: affiliate._id,
        campaign_id: camp._id,
        click_id: Math.random().toString(36).substring(7),
        ip_address: '127.0.0.1',
        device_info: JSON.stringify({ ua: 'Mozilla/5.0', platform: 'Windows', mobile: false }),
        click_timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }

    // Add Conversions
    for (let i = 0; i < 10; i++) {
      const camp = campaigns[i % campaigns.length];
      const revenue = camp.commission_type === 'flat' ? camp.commission_value : (Math.random() * 500 + 100).toFixed(2);
      
      await Conversion.create({
        affiliate_id: affiliate._id,
        campaign_id: camp._id,
        click_id: Math.random().toString(36).substring(7),
        order_id: `ORD-${Math.random().toString(36).substring(7).toUpperCase()}`,
        revenue: parseFloat(revenue),
        status: i < 7 ? 'approved' : 'pending',
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
    }

    console.log('Seeded clicks and conversions for Google User');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedData();
