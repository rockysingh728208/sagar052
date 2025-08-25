import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import cloudinary from "../config/cloudinary.js";
import { sendVerificationEmail } from "../services/sendEmail.js";
import crypto from "crypto";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const file = req.file;

        if (!name || !email || !password || !file) {
            return res.status(400).json({success:false, message: "All fields are required" });
        }

        const existingUser = await userModel.findOne({ email });
        if (existingUser)
         return res.status(400).json({success:false, message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        
        const result = await cloudinary.uploader.upload(file.path, {
            folder: "profiles"
        });

        const verificationCode = crypto.randomBytes(20).toString("hex");

        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            profileImage: result.secure_url,
            verificationCode
        });

        await newUser.save();

        await sendVerificationEmail(email, verificationCode);

        res.status(201).json({ message: "User registered. Please verify your email." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false,message: "internal server error" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { code } = req.params;
        const user = await userModel.findOne({ verificationCode: code });
        if (!user)
             return res.status(400).json({ message: "Invalid verification code" });

        user.isVerified = true;
        user.verificationCode = "";
        await user.save();

        res.json({ success:true,message: "Email verified successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success:false,message: "Internal Server error" });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });
        if (!user)
             return res.status(400).json({success:false, message: "Invalid credentials" });
        if (!user.isVerified)
             return res.status(400).json({success:false, message: "Please verify your email first" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        res.json({success:true, message: "Login successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false, message: "Server error" });
    }
};
