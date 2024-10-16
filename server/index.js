import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from 'path';
import { fileURLToPath } from 'url';


import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

const app = express();
app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
// Trust the first proxy
app.use(cors({
  origin: ["http://localhost:5173", "https://real-estate-marketplace-client.onrender.com"],
  credentials: true,
}));

// Helper to get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
app.use("/api/auth", authRouter); // Auth route
app.use("/api/user", userRouter); // User route
app.use("/api/listing", listingRouter); // Listing route

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
});


// middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
