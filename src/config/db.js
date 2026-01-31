import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // 5 second timeout
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    if (error.message.includes('ETIMEDOUT') || error.message.includes('authentication failed')) {
      console.error('--------------------------------------------------');
      console.error('ERROR: Could not connect to MongoDB Atlas.');
      console.error('This is likely due to your IP address not being whitelisted.');
      console.error('Please add your current IP to the Atlas IP Whitelist:');
      console.error('https://www.mongodb.com/docs/atlas/security-whitelist/');
      console.error('--------------------------------------------------');
    }
    process.exit(1);
  }
};

export default connectDB;
