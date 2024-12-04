
import { storeOtp, getOtp } from "@/models/Otp";
import nodemailer from "nodemailer";

const generateOtp = () => {
	return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtpToEmail = async (email: string) => {
	const otp = generateOtp();

	// Store OTP temporarily
	await storeOtp(email, otp);

	// Send OTP via email
	const transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASSWORD,
		},
	});

	const mailOptions = {
		from: process.env.EMAIL_USER,
		to: email,
		subject: "Your OTP Code",
		text: `Your OTP code is: ${otp}`,
	};

	try {
		await transporter.sendMail(mailOptions);
		console.log("OTP sent to email:", email);
	} catch (error) {
		console.error("Error sending OTP:", error);
	}
};

export const verifyOtp = async (email: string, otp: string) => {
	const storedOtp = await getOtp(email);

	if (storedOtp === otp) {
		return true;
	}
	return false;
};
