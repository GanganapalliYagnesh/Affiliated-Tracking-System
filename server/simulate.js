require('dotenv').config();
const mongoose = require('mongoose');
const Affiliate = require('./models/Affiliate');
const Campaign = require('./models/Campaign');
const Click = require('./models/Click');
const Conversion = require('./models/Conversion');
const Commission = require('./models/Commission');
const crypto = require('crypto');

const simulateTraffic = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/affiliate-db');
    console.log('✅ Connected to MongoDB');

    // Find all affiliates and approve them automatically so they can see their stats
    const affiliates = await Affiliate.find();
    
    for (let aff of affiliates) {
      if (aff.status !== 'approved') {
        aff.status = 'approved';
        if (!aff.affiliate_code) {
           aff.affiliate_code = `auto${Math.floor(Math.random() * 9000) + 1000}`;
        }
        await aff.save();
      }
    }

    const campaigns = await Campaign.find({ status: 'active' });

    if (affiliates.length === 0 || campaigns.length === 0) {
      console.log('❌ Need approved affiliates and active campaigns first.');
      process.exit(1);
    }

    for (const affiliate of affiliates) {
      console.log(`\nGenerating traffic for affiliate: ${affiliate.affiliate_code}`);

      let totalRevenue = 0;
      let totalCommissions = 0;

      for (const campaign of campaigns) {
        // Simulate 50-150 clicks per campaign
        const numClicks = Math.floor(Math.random() * 100) + 50;
        console.log(`- Campaign: ${campaign.name} | Generating ${numClicks} clicks...`);
        
        const clickIds = [];
        for (let i = 0; i < numClicks; i++) {
          const clickId = crypto.randomBytes(16).toString('hex');
          clickIds.push(clickId);
          await Click.create({
            click_id: clickId,
            affiliate_id: affiliate._id,
            campaign_id: campaign._id,
            ip_address: `192.168.1.${Math.floor(Math.random() * 255)}`,
            user_agent: 'Mozilla/5.0 Simulated Browser',
            click_timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
          });
        }

        // Simulate 2-8 conversions per campaign
        const numConversions = Math.floor(Math.random() * 7) + 2;
        console.log(`  -> Generating ${numConversions} conversions...`);
        
        for (let i = 0; i < numConversions; i++) {
          const randomClickId = clickIds[Math.floor(Math.random() * clickIds.length)];
          const orderId = `ORD-${Math.floor(Math.random() * 1000000)}`;
          const revenue = Math.floor(Math.random() * 5000) + 1000;
          
          let commissionAmount = 0;
          if (campaign.commission_type === 'percentage') {
            commissionAmount = (revenue * campaign.commission_value) / 100;
          } else {
            commissionAmount = campaign.commission_value;
          }

          totalRevenue += revenue;
          totalCommissions += commissionAmount;

          const conversion = await Conversion.create({
            click_id: randomClickId,
            affiliate_id: affiliate._id,
            campaign_id: campaign._id,
            order_id: orderId,
            revenue,
            status: 'approved'
          });

          await Commission.create({
            conversion_id: conversion._id,
            affiliate_id: affiliate._id,
            amount: commissionAmount,
            status: 'approved',
            hold_until: new Date()
          });
        }
      }

      // Add to existing earnings
      affiliate.total_earnings = (affiliate.total_earnings || 0) + totalCommissions;
      affiliate.available_balance = (affiliate.available_balance || 0) + totalCommissions;
      await affiliate.save();

      console.log(`✅ Affiliate ${affiliate.affiliate_code} updated!`);
      console.log(`  Revenue Generated: ₹${totalRevenue.toFixed(2)}`);
      console.log(`  Commissions Earned: ₹${totalCommissions.toFixed(2)}`);
    }

    console.log(`\n🎉 All simulations complete!`);
    process.exit(0);
  } catch (error) {
    console.error('Simulation error:', error);
    process.exit(1);
  }
};

simulateTraffic();
