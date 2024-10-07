import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { authenticateToken } from "../utils/authenticateToken.js";

const router = express.Router();

router.put("/update/:id", authenticateToken, updateUser);


export default router;