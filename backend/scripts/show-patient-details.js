require('dotenv').config();
const { MongoClient } = require('mongodb');

async function showPatientDetails() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medihub';
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });

  try {
    await client.connect();
    const db = client.db('medihub');
    const collection = db.collection('patientsusers');
    
    const patients = await collection.find({}).toArray();
    
    console.log('📋 PATIENTSUSERS Collection Data Structure\n');
    console.log('='.repeat(60));
    
    if (patients.length === 0) {
      console.log('\n❌ No patients found in the database.');
      console.log('   Register a patient through the signup form to see data here.\n');
      return;
    }
    
    console.log(`\n✅ Found ${patients.length} patient(s) in the database\n`);
    
    patients.forEach((patient, index) => {
      console.log(`\n👤 PATIENT ${index + 1}:`);
      console.log('─'.repeat(60));
      
      // Basic Information
      console.log('\n📝 BASIC INFORMATION:');
      console.log(`   _id: ${patient._id}`);
      console.log(`   Email: ${patient.email}`);
      console.log(`   First Name: ${patient.firstName}`);
      console.log(`   Last Name: ${patient.lastName}`);
      console.log(`   Phone: ${patient.phone || 'Not provided'}`);
      console.log(`   Role: ${patient.role}`);
      
      // Password (hashed)
      console.log('\n🔒 SECURITY:');
      console.log(`   Password (hashed): ${patient.password?.substring(0, 20)}...`);
      
      // Medical Information
      console.log('\n🏥 MEDICAL INFORMATION:');
      console.log(`   Medical Record Number: ${patient.medicalRecordNumber}`);
      console.log(`   Date of Birth: ${patient.dateOfBirth || 'Not provided'}`);
      console.log(`   Gender: ${patient.gender}`);
      console.log(`   Blood Type: ${patient.bloodType}`);
      
      // Emergency Contact
      if (patient.emergencyContact) {
        console.log('\n🚨 EMERGENCY CONTACT:');
        console.log(`   Name: ${patient.emergencyContact.name}`);
        console.log(`   Relationship: ${patient.emergencyContact.relationship}`);
        console.log(`   Phone: ${patient.emergencyContact.phone}`);
      }
      
      // Account Status
      console.log('\n✅ ACCOUNT STATUS:');
      console.log(`   Active: ${patient.isActive}`);
      console.log(`   Email Verified: ${patient.isEmailVerified}`);
      
      // Timestamps
      console.log('\n⏰ TIMESTAMPS:');
      console.log(`   Created At: ${patient.createdAt}`);
      console.log(`   Updated At: ${patient.updatedAt}`);
      
      // Show all fields
      console.log('\n📦 ALL FIELDS:');
      const allFields = Object.keys(patient).sort();
      allFields.forEach(field => {
        if (!['password'].includes(field)) { // Hide password for security
          const value = patient[field];
          const displayValue = typeof value === 'object' && value !== null 
            ? JSON.stringify(value) 
            : value;
          console.log(`   - ${field}: ${displayValue}`);
        }
      });
      
      console.log('\n' + '='.repeat(60));
    });
    
    console.log('\n✨ Complete!\n');
    
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await client.close();
  }
}

showPatientDetails();
