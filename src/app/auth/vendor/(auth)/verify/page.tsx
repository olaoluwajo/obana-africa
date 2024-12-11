"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAuthStore from "@/stores/authStore";
import { useOtpStore } from "@/stores/useOtpStore";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useVendorStore } from "@/stores/useVendorStore";

function VerifyPageContent() {
	const searchParams = useSearchParams();
	const email = searchParams.get("email");
	const { token, otp } = useOtpStore();
	const [userOtp, setUserOtp] = useState("");
	const [loading, setLoading] = useState(false);
	const [timer, setTimer] = useState(3 * 60);
	const [timerExpired, setTimerExpired] = useState(false);
	const router = useRouter();
	const vendorId = useVendorStore((state) => state.vendorId);
	const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

	// console.log("Current token in store:", token);

	useEffect(() => {
		if (timer === 0) {
			setTimerExpired(true);
			return;
		}
		const interval = setInterval(() => {
			setTimer((prevTimer) => prevTimer - 1);
		}, 1000);

		return () => clearInterval(interval);
	}, [timer]);

	// Format the timer in MM:SS format
	const formatTimer = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes < 10 ? "0" : ""}${minutes}:${
			remainingSeconds < 10 ? "0" : ""
		}${remainingSeconds}`;
	};

	const onSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({ name: userOtp }), 3000));

		console.log(userOtp);
		setLoading(true);
		toast.promise(promise, {
			loading: `Verifying OTP, Please wait...`,

			error: "Error",
		});

		// console.log("Email:", email);
		// console.log("User OTP:", userOtp);
		// console.log("Token:", token);

		if (!email || !userOtp || !token) {
			toast.error("Email, OTP, and token are required.");
			return;
		}

		setLoading(true);

		try {
			// console.log("Sending data to the backend:", { email, otp: userOtp, token });
			const response = await axios.post("/api/send-otp-email/verify-code", {
				email,
				otp: userOtp,
				token,
			});

			console.log(response.data);

			if (response.data.success) {
				useAuthStore.getState().setAuthenticated(true, response.data.token, response.data.role);
				if (vendorId) {
					// Cookies.set("vendorId", vendorId, { expires: 1 });
					// localStorage.setItem("vendorId", vendorId);
				}
				// useAuthStore.getState().setRole(response.data.role);
				localStorage.setItem("otpToken", response.data.token);
				localStorage.setItem("role", response.data.role);
				Cookies.set("otpToken", response.data.token, { expires: 1 });
				Cookies.set("role", response.data.role, { expires: 1 });
				router.push("/vendor/dashboard/overview");
				toast.success("OTP verified successfully!");
			} else {
				toast.error(response.data.message || "Invalid OTP.");
			}
		} catch (error: any) {
			toast.error(error.response.data.message || "Error verifying OTP...");
		} finally {
			setLoading(false);
		}
	};

	// Handle OTP input change
	const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
		const newOtp = userOtp.split("");
		newOtp[index] = e.target.value.slice(0, 1);
		setUserOtp(newOtp.join(""));
		if (e.target.value && index < 5) {
			document.getElementById(`otp-input-${index + 1}`)?.focus();
		}
	};

	// Handle backspace
	const handleBackspace = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
		if (e.key === "Backspace" && userOtp[index] === "" && index > 0) {
			document.getElementById(`otp-input-${index - 1}`)?.focus();
		}
	};

	// Request a new OTP when the timer expires
	const handleRequestNewOtp = async () => {
		setLoading(true);
		try {
			const response = await axios.post("/api/send-otp-email", { email });
			if (response.data.success) {
				toast.success("New OTP sent to your email.");
				setTimer(3 * 60);
				setTimerExpired(false);
				setUserOtp("");
				useOtpStore.getState().setOtp(response.data.otp);
				useOtpStore.getState().setToken(response.data.token);
				useOtpStore.getState().setRole(response.data.role);
			} else {
				toast.error(response.data.message || "Failed to send new OTP.");
			}
		} catch (error) {
			toast.error("Error requesting new OTP.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="h-screen flex  items-center justify-center bg-[#dcfbf9]">
			<div className="max-w-md mx-auto mt-8 px-12 py-8 bg-white shadow-lg border border-slate-300 rounded-lg ">
				<div className="flex flex-col items-center my-4">
					<img src="/logo.png" alt="" className="md:w-[50%] w-[50%] mb-2" />
				</div>
				<h2 className="text-xl font-bold text-center mb-1">Verify Your Email</h2>
				<form onSubmit={onSubmit} className="">
					<div>
						<label className="block text-center mb-4">
							Check your email for Verification Code
						</label>
						<div className="flex justify-between gap-2">
							{[...Array(6)].map((_, index) => (
								<Input
									id={`otp-input-${index}`}
									key={index}
									type="text"
									value={userOtp[index] || ""}
									onChange={(e) => handleOtpChange(e, index)}
									onKeyDown={(e) => handleBackspace(e, index)}
									maxLength={1}
									className="size-12 text-center border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
									disabled={loading}
								/>
							))}
						</div>
					</div>

					<Button disabled={loading} className="w-full text-white mt-6" type="submit">
						{loading ? "Verifying..." : "Verify Code"}
					</Button>
				</form>
				<div className="text-center mt-4">
					<p className="text-sm text-gray-600">
						{timerExpired ? (
							<>
								OTP expired.
								<Button
									variant="link"
									onClick={handleRequestNewOtp}
									className="text-blue-500 underline"
									disabled={loading}>
									Request New OTP
								</Button>
							</>
						) : (
							<>Time remaining: {formatTimer(timer)}</>
						)}
					</p>
				</div>
				<div className="flex justify-center ">
					<Button
						variant="link"
						onClick={() => router.push("/sign-in")}
						className="w-full mx-auto text-blue-500">
						Back to Login
					</Button>
				</div>
			</div>
		</div>
	);
}

export default function VerifyPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<VerifyPageContent />
		</Suspense>
	);
}
