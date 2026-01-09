import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food-del';
        console.log("DB connecting to:", uri);
        await mongoose.connect(uri);
        console.log("DB Connected Successfully");
        return true;
    } catch (error) {
        console.error("DB Connection Error:", error?.message || error);
        console.error('Ensure MONGODB_URI is set in .env or MongoDB is running locally.');
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
        // In development, do not exit the process so nodemon can stay up for debugging.
        return false;
    }
}
export default connectDB;