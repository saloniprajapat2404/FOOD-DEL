import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error('MONGODB_URI is not configured');
        }

        await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
        console.log("DB Connected Successfully");
        return true;
    } catch (error) {
        console.error("DB Connection Error:", error?.message || error);
        return false;
    }
}
export default connectDB;