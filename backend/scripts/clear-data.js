require('dotenv').config();
const { MongoClient } = require('mongodb');

async function clearAllData() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medihub';
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    const db = client.db('medihub');
    
    console.log('🗑️  Clearing all data from collections...\n');
    
    const collections = ['patientsusers', 'hospitalusers', 'medicalusers', 'laboratoriesusers'];
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const result = await collection.deleteMany({});
      console.log(`   ✅ Cleared ${collectionName}: ${result.deletedCount} documents deleted`);
    }
    
    console.log('\n🎉 All data cleared successfully!\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
  }
}

clearAllData();
