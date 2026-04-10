require('dotenv').config();
const { MongoClient } = require('mongodb');

async function showAllUsers() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medihub';
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');
    
    const db = client.db('medihub');
    
    // Fetch Patients
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('👥 PATIENTS');
    console.log('═══════════════════════════════════════════════════════════════\n');
    const patients = await db.collection('patientsusers').find({}).toArray();
    patients.forEach((user, index) => {
      console.log(`Patient ${index + 1}:`);
      console.log(`  Email:    ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Name:     ${user.fullName}`);
      console.log(`  Phone:    ${user.phoneNumber}`);
      console.log('');
    });
    if (patients.length === 0) console.log('  No patients found\n');
    
    // Fetch Doctors
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('👨‍⚕️ DOCTORS');
    console.log('═══════════════════════════════════════════════════════════════\n');
    const doctors = await db.collection('hospitalusers').find({}).toArray();
    doctors.forEach((user, index) => {
      console.log(`Doctor ${index + 1}:`);
      console.log(`  Email:    ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Name:     ${user.fullName || user.name}`);
      console.log(`  Phone:    ${user.phoneNumber || user.phone}`);
      console.log('');
    });
    if (doctors.length === 0) console.log('  No doctors found\n');
    
    // Fetch Staff/Medical Users
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🏥 STAFF/MEDICAL USERS');
    console.log('═══════════════════════════════════════════════════════════════\n');
    const staff = await db.collection('medicalusers').find({}).toArray();
    staff.forEach((user, index) => {
      console.log(`Staff ${index + 1}:`);
      console.log(`  Email:    ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Name:     ${user.fullName || user.name}`);
      console.log(`  Phone:    ${user.phoneNumber || user.phone}`);
      console.log('');
    });
    if (staff.length === 0) console.log('  No staff found\n');
    
    // Fetch Laboratory Users
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('🔬 LABORATORY USERS');
    console.log('═══════════════════════════════════════════════════════════════\n');
    const labs = await db.collection('laboratoriesusers').find({}).toArray();
    labs.forEach((user, index) => {
      console.log(`Lab User ${index + 1}:`);
      console.log(`  Email:    ${user.email}`);
      console.log(`  Password: ${user.password}`);
      console.log(`  Name:     ${user.fullName || user.name}`);
      console.log(`  Phone:    ${user.phoneNumber || user.phone}`);
      console.log('');
    });
    if (labs.length === 0) console.log('  No laboratory users found\n');
    
    // Summary
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('📊 SUMMARY');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log(`Total Patients:   ${patients.length}`);
    console.log(`Total Doctors:    ${doctors.length}`);
    console.log(`Total Staff:      ${staff.length}`);
    console.log(`Total Lab Users:  ${labs.length}`);
    console.log(`Total Users:      ${patients.length + doctors.length + staff.length + labs.length}`);
    console.log('');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
    console.log('✅ Connection closed');
  }
}

showAllUsers();
