import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

console.log('=== MongoDB Atlas Connectivity Diagnostic ===');
console.log('URI:', MONGO_URI ? MONGO_URI.replace(/:([^@]+)@/, ':****@') : 'Not defined in .env');

if (!MONGO_URI) {
  console.error('Error: MONGO_URI is missing from backend/.env');
  process.exit(1);
}

const testConnection = async () => {
  try {
    console.log('\nAttempting to connect to MongoDB Atlas (Timeout set to 5 seconds)...');
    
    // Set low timeout for quick diagnostic response
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    console.log('✅ SUCCESS: Connected to MongoDB Atlas cluster successfully!');
    console.log('Host connected to:', mongoose.connection.host);
    
    // Try a simple write and read test
    const testSchema = new mongoose.Schema({ name: String }, { timestamps: true });
    const TestModel = mongoose.models.TestConnection || mongoose.model('TestConnection', testSchema);
    
    console.log('\nRunning write test...');
    const doc = new TestModel({ name: 'TadkaMode Connection Test' });
    await doc.save();
    console.log('✅ SUCCESS: Write operation completed.');

    console.log('\nRunning read test...');
    const fetched = await TestModel.findById(doc._id);
    console.log('✅ SUCCESS: Read operation completed. Fetched doc:', fetched.name);

    console.log('\nCleaning up test document...');
    await TestModel.findByIdAndDelete(doc._id);
    console.log('✅ SUCCESS: Cleanup completed.');

    await mongoose.disconnect();
    console.log('\nDiagnostic complete. Your database is fully connected and functioning.');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ FAILURE: Could not connect to MongoDB Atlas.');
    console.error('Error message:', error.message);
    
    console.log('\n======================================================');
    console.log('👉 HOW TO RESOLVE THIS ISSUE:');
    console.log('1. Log in to your MongoDB Atlas dashboard (https://cloud.mongodb.com/).');
    console.log('2. Click on "Network Access" in the left sidebar (under Security).');
    console.log('3. Click the "+ Add IP Address" button.');
    console.log('4. Choose one of the options:');
    console.log('   - Click "Add Current IP Address" to authorize your current Mac machine.');
    console.log('   - Click "Allow Access From Anywhere" (which whitelists 0.0.0.0/0) if your IP is dynamic or you travel.');
    console.log('5. Click "Confirm" and wait ~30 seconds for Atlas to update the firewall.');
    console.log('6. Rerun this diagnostic script: node test_db_connection.js');
    console.log('======================================================\n');
    
    process.exit(1);
  }
};

testConnection();
