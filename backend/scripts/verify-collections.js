require('dotenv').config();
const { MongoClient } = require('mongodb');

async function verifyCollections() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medihub';
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    const db = client.db('medihub');
    
    console.log('📊 Current Database Collections:\n');
    
    const collections = ['patientsusers', 'hospitalusers', 'medicalusers', 'laboratoriesusers'];
    
    for (const collectionName of collections) {
      const collection = db.collection(collectionName);
      const count = await collection.countDocuments();
      const docs = await collection.find({}).limit(5).toArray();
      
      console.log(`\n📁 ${collectionName.toUpperCase()}`);
      console.log(`   Total documents: ${count}`);
      
      if (docs.length > 0) {
        console.log('   Sample documents:');
        docs.forEach((doc, index) => {
          console.log(`   ${index + 1}. ${doc.email} (${doc.role}) - Created: ${doc.createdAt}`);
          if (doc.medicalRecordNumber) {
            console.log(`      MRN: ${doc.medicalRecordNumber}`);
          }
        });
      } else {
        console.log('   No documents yet');
      }
    }
    
    console.log('\n✅ Collection verification complete!\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
  }
}

verifyCollections();
