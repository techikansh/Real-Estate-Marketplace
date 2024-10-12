import express from "express";
import {
    createListing,
    deleteUserListing,
    getListingById,
    updateUserListing
} from "../controllers/listing.controller.js";
import { authenticateToken } from "../utils/authenticateToken.js";
const router = express.Router();

router.post("/create", authenticateToken, createListing);
router.delete("/delete/:id", authenticateToken, deleteUserListing);
router.put("/update/:id", authenticateToken, updateUserListing);
router.get("/get/:id", getListingById);

export default router;
