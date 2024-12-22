import { getMailAccessToken } from "@/helpers/zohoAuthToken";
import axios from "axios";
import { storeOtp } from "@/models/Otp";
import jwt from "jsonwebtoken";

function generateOtp(): string {
	const otp = Math.floor(100000 + Math.random() * 900000);
	return otp.toString();
}

function generateJwtToken(email: string, otp: string, role: string): string {
	// Use JWT to generate a token with expiration (e.g., 5 minutes)
	const payload = {
		role,
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

		 let role = "vendor";

		// Generate OTP
		const otp = generateOtp();
		// console.log("OTP", otp);

		// Generate JWT token with OTP and expiration
	 const token = generateJwtToken(email, otp, role);
		// console.log("JWT Token", token);

		// Store OTP in MongoDB
		await storeOtp(email, otp);

		// Send OTP via email
		const accessToken = await getMailAccessToken();
		const accountId = process.env.ZOHO_MAIL_ACCOUNT_ID;

		const emailData = {
			fromAddress: "'OBANA.AFRICA VENDOR' <ochije.nnani@iconholding.africa>",
			toAddress: email,
			subject: `${otp} is your vendor verification code`,
			content: `
    <div style="font-family: Arial, sans-serif; text-align: center; border: 1px solid #ddd; padding: 20px; max-width: 600px; margin: auto;">
      <img src="https://www.obana.africa/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fobana.africa.6c072a90.png&w=1920&q=75" alt="Obana Office Logo" style="width: 100px; margin-bottom: 20px;" />
      <p style="font-size: 18px; color: #555;">Dear ${email},</p>

      <p style="font-size: 16px; color: #555;">There is the final step to complete the vendor login</p>
      <h1 style="font-size: 32px; color: #007BFF;">${otp}</h1>
      <p style="font-size: 14px; color: #999;">If you didn't request this verification code, you can safely ignore this email. Someone else might have typed your email address by mistake.</p>
      <p style="font-size: 14px; color: #999;">This email has been automatically generated. Please do not reply.</p>
      <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;" />
      <p style="font-size: 12px; color: #999;">To learn more about obana.africa, click here. <a href="https://www.obana.africa/about" style="color: #007BFF;">info.obana</a></p>
    </div>
  `,
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
				JSON.stringify({ success: true, token, role, otp, message: "OTP email sent successfully" }),
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
