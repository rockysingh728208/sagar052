import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const sendVerificationEmail = async (email, code) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Email Verification",
            html: `<p>Click <a href="${process.env.CLIENT_URL}/verify/${code}">here</a> to verify your email.</p>`
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification email sent to:", email);
    } catch (error) {
        console.log(error);
        throw new Error("Email sending failed");
    }
};
