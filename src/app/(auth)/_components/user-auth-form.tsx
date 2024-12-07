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
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useOtpStore } from "@/stores/useOtpStore";
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
	const [vendorExistsError, setVendorExistsError] = useState("");
	// const defaultValues = {
	// 	email: "demo@gmail.com",
	// };
	const form = useForm<UserFormValue>({
		resolver: zodResolver(formSchema),
		// defaultValues,
	});

	const onSubmit = async (data: UserFormValue) => {
		console.log("DATA", data);
		setVendorExistsError("");
		startTransition(async () => {
			try {
				const response = await axios.get(`/api/check-vendor-exists?email=${data.email}`);

				if (response.data.vendorExists) {
					const otpResponse = await axios.post("/api/send-otp-email", {
						email: data.email,
					});

					// console.log("RESPONSE", response);

					const result = otpResponse.data;
					console.log("RESULT", result);

					localStorage.setItem("otpToken", result.token);
					if (result.success) {
						useOtpStore.getState().setOtp(result.otp);
						useOtpStore.getState().setToken(result.token);
						router.push(`/verify?email=${data.email}`);
						toast.success("A sign-in OTP has been sent to your email!");
						// await requestOtp(data.email);
					} else {
						toast.error("Failed to send the sign-in link. Please try again later.");
					}
				} else {
					setVendorExistsError("You are not a vendor. Please register.");
				}
			} catch (error) {
				toast.error("Error sending sign-in email. Please try again.");
			}
		});
	};

	return (
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
										disabled={loading}
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button disabled={loading} className="ml-auto w-full text-white" type="submit">
						{loading ? "Please wait..." : "Continue With Email"}
					</Button>
					{loading && (
						<p className="text-center text-sm text-gray-500">
							Please sit back, this may take a while confirming your email...
						</p>
					)}
				</form>
			</Form>
			{vendorExistsError && (
				<div className="text-red-500 mt-4 text-sm text-center">
					<p>{vendorExistsError}</p>
					<a href="/sign-up" className="text-blue-500">
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
