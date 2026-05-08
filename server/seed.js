require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Affiliate = require('./models/Affiliate');
const Campaign = require('./models/Campaign');

const PLAIN_PASSWORD = 'Admin@123'; // Pre-save hook in User model handles hashing

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/affiliate-db');
    console.log('✅ Connected to MongoDB');

    // Clean existing
    await User.deleteMany({});
    await Affiliate.deleteMany({});
    await Campaign.deleteMany({});
    console.log('🗑️  Cleared existing data');


    // Create Admin
    const admin = await User.create({
      name: 'Platform Admin',
      email: 'admin@demo.com',
      mobile: '9876543210',
      password: PLAIN_PASSWORD,
      role: 'admin'
    });
    console.log('👑 Admin created:', admin.email);

    // Create Affiliate User
    const affUser = await User.create({
      name: 'Rahul Sharma',
      email: 'rahul@affiliate.com',
      mobile: '9123456789',
      password: PLAIN_PASSWORD,
      role: 'affiliate'
    });

    // Create Affiliate Profile (approved with code)
    const affiliate = await Affiliate.create({
      user_id: affUser._id,
      affiliate_code: 'rahul123',
      status: 'approved',
      pan_number: 'ABCDE1234F',
      bank_account: '12345678901',
      ifsc_code: 'SBIN0001234',
      upi_id: 'rahul@upi',
      youtube_url: 'https://youtube.com/@rahulsharma',
      instagram_handle: '@rahulsharma',
      website_url: 'https://rahulsharma.in'
    });
    console.log('🙋 Affiliate created:', affUser.email, '| Code:', affiliate.affiliate_code);

    // Create pending affiliate
    const pendingUser = await User.create({
      name: 'Priya Patel',
      email: 'priya@affiliate.com',
      mobile: '9988776655',
      password: PLAIN_PASSWORD,
      role: 'affiliate'
    });
    await Affiliate.create({
      user_id: pendingUser._id,
      status: 'pending',
      pan_number: 'FGHIJ5678K',
      bank_account: '98765432101',
      ifsc_code: 'HDFC0001234',
      upi_id: 'priya@upi'
    });
    console.log('⏳ Pending affiliate created:', pendingUser.email);

    // Create Campaigns
    await Campaign.create([
      {
        name: 'Premium Watches Sale',
        product_name: 'LuxWatch Pro',
        commission_type: 'percentage',
        commission_value: 10,
        cookie_duration: 30,
        attribution_model: 'last-click',
        status: 'active'
      },
      {
        name: 'Skincare Bundle',
        product_name: 'GlowKit Deluxe',
        commission_type: 'flat',
        commission_value: 250,
        cookie_duration: 60,
        attribution_model: 'first-click',
        status: 'active'
      },
      {
        name: 'Tech Accessories',
        product_name: 'SmartGear Pro',
        commission_type: 'percentage',
        commission_value: 8,
        cookie_duration: 90,
        attribution_model: 'multi-touch',
        status: 'active'
      }
    ]);
    console.log('📣 3 Campaigns created');

    console.log('\n✨ Seed Complete!');
    console.log('─────────────────────────────────');
    console.log('👑 Admin Login:    admin@demo.com     | Admin@123');
    console.log('✅ Affiliate:      rahul@affiliate.com | Admin@123 (Approved)');
    console.log('⏳ Affiliate:      priya@affiliate.com | Admin@123 (Pending)');
    console.log('─────────────────────────────────');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message);
    process.exit(1);
  }
};

seed();
