import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js"
import foodRouter from "./routes/foodRoute.js";
import authRouter from "./routes/authRoute.js";
import orderRouter from "./routes/orderRoute.js";

dotenv.config();

//app config
const app = express()
const port = process.env.PORT || 4000;

//middlewares
app.use(express.json())
app.use(cors())

// global error handlers for clearer crash logs
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err?.message || err);
    if (process.env.NODE_ENV === 'production') process.exit(1);
});
process.on('unhandledRejection', (reason) => {
    console.error('Unhandled Rejection:', reason);
    if (process.env.NODE_ENV === 'production') process.exit(1);
});

//db connection — start server only after attempting DB connect
const startServer = async () => {
    const dbOk = await connectDB();
    if (dbOk === false) {
        console.warn('DB connect failed; server will continue in development mode.');
    }
    // api endpoints
    app.use("/api/food", foodRouter)
    app.use("/api/auth", authRouter)
    app.use("/api/order", orderRouter)
    app.use("/images",express.static('uploads'))

    app.get("/", (req, res) => {
        res.send("API Working")
    })

    app.listen(port, () => {
        console.log(`Server Started on http://localhost:${port}`)
    })
}

startServer();

// api endpoints
//mongodb+srv://greatstack:AnjAli_09@cluster0.tvnlr4k.mongodb.net/?appName=Cluster0

//mongodb+srv://greatstack:AnjAli_09@cluster0.tvnlr4k.mongodb.net/?appName=Cluster0