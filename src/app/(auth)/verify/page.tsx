"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/stores/authStore";
import { useOtpStore } from "@/stores/useOtpStore";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function VerifyPage() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const { token, otp } = useOtpStore();
	const [userOtp, setUserOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const router = useRouter();
	const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

	// console.log("Current token in store:", token);

	// Submit handler for OTP verification
	const onSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		console.log("Email:", email);
		console.log("User OTP:", userOtp);
		console.log("Token:", token);

		if (!email || !userOtp || !token) {
			toast.error("Email, OTP, and token are required.");
			return;
		}

		setLoading(true);

		try {
			// console.log("Sending data to the backend:", { email, otp: userOtp, token });
			// Send OTP and token to the backend for verification
			const response = await axios.post("/api/send-otp-email/verify-code", {
				email,
				otp: userOtp,
				token,
			});

			console.log(response.data);

			if (response.data.success) {
				  setAuthenticated(true);
				useOtpStore.getState().clearOtp();
				useOtpStore.getState().clearToken();
				router.push("/dashboard");
				toast.success("OTP verified successfully!");
			} else {
				toast.error(response.data.message || "Invalid OTP.");
			}
		} catch (error) {
			toast.error("Error verifying OTP.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="max-w-md mx-auto mt-8">
			<h2 className="text-2xl font-bold">Verify Your Email</h2>
			<form onSubmit={onSubmit} className="space-y-4">
				<div>
					<label className="block">Verification Code</label>
					<Input
						type="text"
						value={userOtp}
						onChange={(e) => setUserOtp(e.target.value)}
						maxLength={6}
						placeholder="Enter the 6-digit code"
						disabled={loading}
					/>
				</div>

				<Button disabled={loading} className="w-full text-white" type="submit">
					Verify Code
				</Button>
			</form>
			<div className="flex justify-center">
				<Button onClick={() => router.push("/")} className="w-full mx-auto text-white mt-8">
					Back to Login
				</Button>
			</div>
		</div>
	);
}
