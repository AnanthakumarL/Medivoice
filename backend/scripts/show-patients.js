const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medihub';

async function showPatients() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;
    const collection = db.collection('patientsusers');

    const patients = await collection.find({}).toArray();

    console.log(`📊 Total Patients: ${patients.length}\n`);

    patients.forEach((patient, index) => {
      console.log(`Patient ${index + 1}:`);
      console.log(JSON.stringify(patient, null, 2));
      console.log('\n' + '─'.repeat(80) + '\n');
    });

    await mongoose.connection.close();
    console.log('✅ Connection closed');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

showPatients();
