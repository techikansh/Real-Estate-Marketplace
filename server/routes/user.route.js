import express from "express";
import {
    updateUser,
    deleteUser,
    getUserListings,
    getUserByListingId,
} from "../controllers/user.controller.js";
import { authenticateToken } from "../utils/authenticateToken.js";

const router = express.Router();

router.put("/update/:id", authenticateToken, updateUser);
router.delete("/delete/:id", authenticateToken, deleteUser);
router.get("/listings/:id", authenticateToken, getUserListings);
router.get("/get/:id", authenticateToken, getUserByListingId)


export default router;
