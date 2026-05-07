const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const Affiliate = require('../server/models/Affiliate');

async function approveAll() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const result = await Affiliate.updateMany({}, { status: 'approved' });
    console.log(`Approved ${result.modifiedCount} affiliates`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

approveAll();
