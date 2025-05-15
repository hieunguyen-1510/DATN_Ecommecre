import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {

    const dbURI = process.env.MONGO_URI;

    // Connect MongoDB
    const conn = await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connect successfully to MongoDB!');
  } catch (error) {
    console.error('Connect failed to MongoDB!', error.message);
    process.exit(1); 
  }
};

export default connectDB;
