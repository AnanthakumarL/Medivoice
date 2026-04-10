const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/medihub';

async function createAppointmentsCollection() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const db = mongoose.connection.db;

    // Create appointments collection
    const collections = await db.listCollections({ name: 'appointments' }).toArray();
    
    if (collections.length === 0) {
      await db.createCollection('appointments');
      console.log('✅ Created appointments collection');
    } else {
      console.log('ℹ️  Appointments collection already exists');
    }

    // Create indexes for better performance
    const appointmentsCollection = db.collection('appointments');
    
    await appointmentsCollection.createIndex({ patientEmail: 1 });
    await appointmentsCollection.createIndex({ appointmentDate: 1 });
    await appointmentsCollection.createIndex({ status: 1 });
    console.log('✅ Created indexes on appointments collection');

    // Insert a sample appointment for testing
    const sampleAppointment = {
      patientName: "Sample Patient",
      patientEmail: "sample@example.com",
      patientPhone: "1234567890",
      doctorId: "1",
      doctorName: "Dr. Sarah Johnson",
      doctorSpecialty: "Cardiology",
      hospital: "City General Hospital",
      appointmentDate: new Date(),
      appointmentTime: "10:00 AM",
      appointmentType: "consultation",
      reasonForVisit: "Regular checkup",
      symptoms: "None",
      additionalNotes: "Sample appointment",
      consultationFee: 250,
      platformFee: 50,
      totalAmount: 300,
      status: "scheduled",
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('\n📋 Sample appointment structure:');
    console.log(JSON.stringify(sampleAppointment, null, 2));

    await mongoose.connection.close();
    console.log('\n✅ Setup complete! Appointments collection is ready.');
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

createAppointmentsCollection();
