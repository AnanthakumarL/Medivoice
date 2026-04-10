require('dotenv').config();
const { MongoClient } = require('mongodb');

async function init() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medihub';
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  // Keep in sync with Mongoose model names (pluralized by default)
  const dbNameFromUri = (() => {
    try {
      const afterSlash = uri.split('/').pop() || 'medihub';
      return afterSlash.includes('?') ? afterSlash.split('?')[0] : afterSlash;
    } catch { return 'medihub'; }
  })();

  const collections = [
    'patientsusers',
    'hospitalusers',
    'medicalusers',
    'laboratoriesusers'
  ];

  try {
    console.log('🗃️  Connecting to MongoDB:', uri);
    await client.connect();
    const db = client.db(dbNameFromUri || 'medihub');
    console.log('✅ Connected. Using DB:', db.databaseName);

    const existing = await db.listCollections().toArray();
    const existingNames = new Set(existing.map(c => c.name));

    for (const name of collections) {
      if (!existingNames.has(name)) {
        console.log(`➕ Creating collection: ${name}`);
        await db.createCollection(name);
      } else {
        console.log(`✔️  Collection exists: ${name}`);
      }
    }

    console.log('🎉 Database initialization complete.');
  } catch (err) {
    console.error('❌ Failed to initialize database:', err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
}

init();
