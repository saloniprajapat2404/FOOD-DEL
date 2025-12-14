import mongoose from "mongoose";

export const connectDB = async () => {
    (await mongoose.connect('mongodb+srv://greatstack:AnjAli_09@cluster0.tvnlr4k.mongodb.net/food-del'));
    console.log("DB Connected");

}
export default connectDB;