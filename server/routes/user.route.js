import express from "express";
import { updateUser, deleteUser } from "../controllers/user.controller.js";
import { authenticateToken } from "../utils/authenticateToken.js";

const router = express.Router();

router.put("/update/:id", authenticateToken, updateUser);
router.delete("/delete/:id", authenticateToken, deleteUser);


export default router;