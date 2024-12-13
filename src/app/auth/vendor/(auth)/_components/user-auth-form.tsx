"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
// import { useOtpStore } from "@/stores/useOtpStore";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useOtpStore } from "@/stores/useOtpStore";
import useAuthStore from "@/stores/authStore";
import { useVendorStore } from "@/stores/useVendorStore";
// import { useVendorStore } from "@/stores/useVendorStore";

// import checkIfVendorExists from "@/helpers/isVendorExistHelper";
// import GithubSignInButton from './github-auth-button';

const formSchema = z.object({
	email: z.string().email({ message: "Enter a valid email address" }),
});

type UserFormValue = z.infer<typeof formSchema>;

export default function UserAuthForm() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");
	const router = useRouter();
	const [loading, startTransition] = useTransition();
	const [isLoading, setIsLoading] = useState(false);
	const [vendorExistsError, setVendorExistsError] = useState("");
	const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
	const role = useAuthStore((state: any) => state.role);
	// const defaultValues = {
	// 	email: "demo@gmail.com",
	// };
	const form = useForm<UserFormValue>({
		resolver: zodResolver(formSchema),
		// defaultValues,
	});

	useEffect(() => {
		// console.log("Authenticated:", isAuthenticated);
		// console.log("Role:", role);
		if (isAuthenticated) {
			if (role === "vendor") {
				// console.log("Redirecting to vendor dashboard...");
				router.push("/vendor/dashboard");
			} else if (role === "admin") {
				// console.log("Redirecting to admin dashboard...");
				router.push("/admin/dashboard");
			}
		}
	}, [isAuthenticated, role, router]);

	const onSubmit = async (data: UserFormValue) => {
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({ name: data.email }), 3000));

		console.log("DATA", data);
		setIsLoading(true);
		setVendorExistsError("");

		toast.promise(promise, {
			loading: "Checking if vendor exists, Please wait...",
			error: "Error",
		});
		startTransition(async () => {
			try {
				const response = await axios.get(`/api/check-vendor-exists?email=${data.email}`);
				console.log("RESPONSE", response.data);
				const { exists, vendorId, vendorName } = response.data;
				// localStorage.setItem("vendorName", vendorName);
				useVendorStore.getState().setVendorName(vendorName);

				if (exists) {
					console.log(`Vendor exists with ID: ${vendorId}`);
					const otpResponse = await axios.post("/api/send-otp-email", {
						email: data.email,
						vendorId: vendorId,
						vendorName: vendorName,
					});

					console.log("OTP RESPONSE", otpResponse);

					const result = otpResponse.data;
					console.log("RESULT", result);

					if (result.success) {
						useVendorStore.getState().setVendorId(vendorId);
						useAuthStore.getState().setRole(result.role);
						useOtpStore.getState().setRole(result.role);
						useOtpStore.getState().setOtp(result.otp);
						useOtpStore.getState().setToken(result.token);
						if (result.role === "vendor") {
							router.push(`/auth/vendor/verify?email=${data.email}`);
						} else if (result.role === "admin") {
							router.push(`/auth/admin/verify?email=${data.email}`);
						}
						toast.success("A sign-in OTP has been sent to your email!");
					} else {
						toast.error("Failed to send the sign-in link. Please try again later.");
					}
				} else {
					setVendorExistsError("You are not a vendor. Please register.");
				}
			} catch (error) {
				toast.error("Error sending sign-in email. Please try again.");
			} finally {
				setIsLoading(false);
			}
		});
	};

	return isAuthenticated ? (
		<div>Loading...</div>
	) : (
		<>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type="email"
										placeholder="Enter your email..."
										disabled={isLoading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={isLoading} className="ml-auto w-full text-white" type="submit">
						{isLoading ? "Please wait..." : "Continue With Email"}
					</Button>
					{isLoading && (
						<p className="text-center text-sm text-gray-500">
							Please sit back, this may take a while confirming your email...
						</p>
					)}
				</form>
			</Form>
			{vendorExistsError && (
				<div className="text-red-500 mt-4 text-sm text-center">
					<p>{vendorExistsError}</p>
					<a href="/auth/vendor/sign-up" className="text-blue-500">
						Click here to <span className="font-bold">register</span> as a vendor.
					</a>
				</div>
			)}
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
			</div>
		</>
	);
}
