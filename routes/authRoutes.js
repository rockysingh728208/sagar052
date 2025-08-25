import express from "express";
import { register, verifyEmail, login } from "../controllers/authController.js";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/register", upload.single("profileImage"), register);
router.get("/verify/:code", verifyEmail);
router.post("/login", login);

export default router;
