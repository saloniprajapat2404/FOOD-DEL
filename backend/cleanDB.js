import mongoose from "mongoose";
import foodModel from "./models/foodModel.js";

const cleanDatabase = async () => {
    try {
        await mongoose.connect('mongodb+srv://greatstack:AnjAli_09@cluster0.tvnlr4k.mongodb.net/food-del');
        console.log("Connected to DB");
        
        // Find and delete items with bad image filenames
        const result = await foodModel.deleteMany({
            image: { $regex: "\\$\\(req.file.filename\\)|^\\(" }
        });
        
        console.log(`Deleted ${result.deletedCount} items with bad image filenames`);
        process.exit(0);
    } catch (error) {
        console.log("Error:", error.message);
        process.exit(1);
    }
};

cleanDatabase();
