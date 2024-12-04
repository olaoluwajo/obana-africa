import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getOtp, deleteOtp } from "@/models/Otp";

export async function POST(req: NextRequest) {
	try {
		// Parse the incoming request
		const { email, otp, token } = await req.json();

		// Basic validation
		if (!email || !otp || !token) {
			return NextResponse.json(
				{ success: false, message: "Email, OTP, and token are required" },
				{ status: 400 },
			);
		}

		// Verify the JWT token first
		let decoded;
		try {
			decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { email: string; otp: string };
			console.log("DECODED", decoded);
		} catch (err) {
			return NextResponse.json(
				{ success: false, message: "Invalid or expired token" },
				{ status: 400 },
			);
		}

		// Ensure that the token's email matches the email provided in the request
		if (decoded.email !== email) {
			return NextResponse.json(
				{ success: false, message: "Token does not match the email" },
				{ status: 400 },
			);
		}

		// Retrieve the stored OTP from the database for the email
		const storedOtp = await getOtp(email);
		console.log("STORED OTP", storedOtp);

		if (storedOtp === otp) {
			console.log("OTP MATCHED");
			if (decoded.otp === otp) {
				console.log("OTP MATCHED");
				await deleteOtp(email);
				return NextResponse.json({ success: true, message: "OTP verified successfully" });
			} else {
				return NextResponse.json(
					{ success: false, message: "Invalid OTP (JWT mismatch)" },
					{ status: 400 },
				);
			}
		} else {
			return NextResponse.json(
				{ success: false, message: "Invalid OTP (Database mismatch)" },
				{ status: 400 },
			);
		}
	} catch (error) {
		console.error("Error verifying OTP:", error);
		return NextResponse.json(
			{ success: false, message: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
