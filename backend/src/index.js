import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser";

const app=express();
import { connectDB } from "./lib/db.js";
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connect } from "mongoose";

dotenv.config();

const PORT=process.env.PORT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

app.listen(PORT,()=>{
    console.log("app is running at port 5001")
    connectDB()
})