require('dotenv').config();
const { MongoClient } = require('mongodb');

async function resetDatabase() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medihub';
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    console.log('🗃️  Connecting to MongoDB:', uri);
    await client.connect();
    
    const dbNameFromUri = (() => {
      try {
        const afterSlash = uri.split('/').pop() || 'medihub';
        return afterSlash.includes('?') ? afterSlash.split('?')[0] : afterSlash;
      } catch { return 'medihub'; }
    })();
    
    const db = client.db(dbNameFromUri || 'medihub');
    console.log('✅ Connected. Using DB:', db.databaseName);

    // Get all existing collections
    const existing = await db.listCollections().toArray();
    console.log('\n📋 Current collections:', existing.map(c => c.name).join(', '));

    // Collections to remove
    const oldCollections = [
      'users',
      'doctors',
      'patients',
      'laboratories',
      'staff',
      'appointments',
      'medicalrecords',
      'prescriptions'
    ];

    // Drop old collections
    console.log('\n🗑️  Removing old collections...');
    for (const name of oldCollections) {
      try {
        const collections = await db.listCollections({ name }).toArray();
        if (collections.length > 0) {
          await db.collection(name).drop();
          console.log(`   ✅ Dropped: ${name}`);
        }
      } catch (err) {
        // Collection might not exist, that's okay
        console.log(`   ⚠️  Skipped: ${name} (doesn't exist)`);
      }
    }

    // New collections to create
    const newCollections = [
      'patientsusers',
      'hospitalusers',
      'medicalusers',
      'laboratoriesusers'
    ];

    // Create new collections
    console.log('\n➕ Creating new collections...');
    for (const name of newCollections) {
      const collections = await db.listCollections({ name }).toArray();
      if (collections.length === 0) {
        await db.createCollection(name);
        console.log(`   ✅ Created: ${name}`);
      } else {
        console.log(`   ✔️  Already exists: ${name}`);
      }
    }

    console.log('\n🎉 Database reset complete!');
    console.log('\n📊 Final collections:');
    const finalCollections = await db.listCollections().toArray();
    finalCollections.forEach(c => console.log(`   - ${c.name}`));

  } catch (err) {
    console.error('❌ Failed to reset database:', err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

resetDatabase();
