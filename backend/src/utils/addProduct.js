import mongoose from "mongoose";
import FAQ from "../models/faqsModel";
import dotenv from "dotenv";

dotenv.config();

const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)

.then (async () => {
    console.log("Connected to MongoDB!");

    try {
        await FAQ.deleteMany({}); // xoa du lieu cu

        const productData = [
            {
                question: "Trạng thái sản phẩm"
            }
        ]
    } catch (error) {
        
    }
})