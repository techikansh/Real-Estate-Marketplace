import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";

import authRouter from "./routes/auth.route.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));


// Auth routes
app.use("/api/auth", authRouter);


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
