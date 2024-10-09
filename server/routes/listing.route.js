import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { authenticateToken } from "../utils/authenticateToken.js";
const router = express.Router();

router.post ("/create", authenticateToken ,createListing)


export default router;