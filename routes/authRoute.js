import express from "express";
import { register, login, updateAvatar, updateProfile, updatePassword, getUser } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update-avatar", authMiddleware, updateAvatar);
router.put("/update-profile", authMiddleware, updateProfile);
router.put('/change-password', authMiddleware, updatePassword);
router.get("/me", authMiddleware, getUser);

export default router;
