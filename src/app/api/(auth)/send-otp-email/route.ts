import { getMailAccessToken } from "@/helpers/zohoAuthToken";
import axios from "axios";
import { storeOtp } from "@/models/Otp";
import jwt from "jsonwebtoken";

function generateOtp(): string {
	const otp = Math.floor(100000 + Math.random() * 900000);
	return otp.toString();
}

function generateJwtToken(email: string, otp: string): string {
	// Use JWT to generate a token with expiration (e.g., 5 minutes)
	const payload = {
		email,
		otp,
	};
	const token = jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: "3m" });
	return token;
}

export async function POST(req: Request) {
	try {
		const { email } = await req.json();

		if (!email) {
			return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
		}

		// Generate OTP
		const otp = generateOtp();
		// console.log("OTP", otp);

		// Generate JWT token with OTP and expiration
		const token = generateJwtToken(email, otp);
		// console.log("JWT Token", token);

		// Store OTP in MongoDB
		await storeOtp(email, otp);

		// Send OTP via email
		const accessToken = await getMailAccessToken();
		const accountId = process.env.ZOHO_MAIL_ACCOUNT_ID;

		const emailData = {
			fromAddress: "'VENDOR OTP' <ochije.nnani@iconholding.africa>",
			toAddress: email,
			subject: "Your OTP Code",
			content: `<p>Your 6-digit OTP code is:<h1><strong>${otp}</strong></h1></p>`,
		};

		const apiUrl = `https://mail.zoho.com/api/accounts/${accountId}/messages`;

		const response = await axios.post(apiUrl, emailData, {
			headers: {
				Authorization: `Zoho-oauthtoken ${accessToken}`,
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		});

		if (response.status === 200) {
			return new Response(
				JSON.stringify({ success: true, token, otp, message: "OTP email sent successfully" }),
				{ status: 200 },
			);
		} else {
			throw new Error(response.data.message || "Failed to send email");
		}
	} catch (error: any) {
		console.error("Error sending OTP email:", error);
		return new Response(JSON.stringify({ error: error.message || "Failed to send OTP email" }), {
			status: 500,
		});
	}
}
