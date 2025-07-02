import mongoose from "mongoose";
import dotenv from 'dotenv'

dotenv.config();
const DBconnection = async () => {
  try {
    
    await mongoose.connect(`${process.env.DB_URL}`);
    console.log("🤖 Database connected successfully");
  } catch (error) {
    console.log("MongoDB connection Failed", error);
  }
};

export default DBconnection;
