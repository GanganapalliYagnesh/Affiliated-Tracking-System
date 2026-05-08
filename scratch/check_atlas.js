const mongoose = require('mongoose');
require('dotenv').config();

async function checkAtlas() {
  try {
    console.log('Connecting to:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected!');

    const admin = mongoose.connection.db.admin();
    const dbs = await admin.listDatabases();
    console.log('\nAvailable Databases:');
    dbs.databases.forEach(db => console.log(`- ${db.name}`));

    const currentDb = mongoose.connection.db.databaseName;
    console.log(`\nCurrent Database: ${currentDb}`);

    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('\nCollections in current DB:');
    for (let col of collections) {
      const count = await mongoose.connection.db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }

    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkAtlas();
