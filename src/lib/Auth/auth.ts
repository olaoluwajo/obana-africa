import nodemailer from "nodemailer";
import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import { setToken } from "./token";

// Setup email transporter (use your email service like SendGrid, Gmail, etc.)
const transporter = nodemailer.createTransport({
	service: "gmail", // or your email service
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASSWORD,
	},
});

// Helper function to generate a random 4-digit code
const generateCode = () => {
	return Math.floor(1000 + Math.random() * 9000).toString();
};

export const sendSignInEmail = async (email: string) => {
	const code = generateCode();

	// Store the code in the database or a cache system for verification
	await setToken(email, code);

	try {
		// Send email with the code
		await transporter.sendMail({
			from: process.env.EMAIL_USER,
			to: email,
			subject: "Sign In to Your Account",
			html: `
        <p>Your verification code is: <strong>${code}</strong></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
		});

		return { success: true };
	} catch (error) {
		console.error("Error sending email:", error);
		return { success: false };
	}
};
