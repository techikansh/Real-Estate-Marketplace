import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';


import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import listingRouter from "./routes/listing.route.js";

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.set('trust proxy', 1);
app.use(express.json());
app.use(cookieParser());
// Trust the first proxy
app.use(cors({
  origin: ["http://localhost:5173", "https://real-estate-marketplace-client.onrender.com"],
  credentials: true,
}));

const clientDistPath = join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath));



// Routes
app.use("/api/auth", authRouter); // Auth route
app.use("/api/user", userRouter); // User route
app.use("/api/listing", listingRouter); // Listing route


app.get('*', (req, res) => {
  res.sendFile(join(clientDistPath, 'index.html'));
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
