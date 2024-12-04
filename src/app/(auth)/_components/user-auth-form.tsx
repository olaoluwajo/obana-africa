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
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useOtpStore } from "@/stores/useOtpStore";
// import GithubSignInButton from './github-auth-button';

const formSchema = z.object({
	email: z.string().email({ message: "Enter a valid email address" }),
});

type UserFormValue = z.infer<typeof formSchema>;

async function requestOtp(email: string) {
	try {
		const response = await fetch("/api/send-otp-email", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ email }),
		});

		const data = await response.json();

		// console.log("DATA", data);

		if (data.success) {
			localStorage.setItem("otpToken", data.token);
			useOtpStore.getState().setOtp(data.otp);
			useOtpStore.getState().setToken(data.token);
			console.log("OTP sent successfully");
		} else {
			console.log("Error sending OTP:", data.message);
		}
	} catch (error) {
		console.error("Error sending OTP:", error);
	}
}

export default function UserAuthForm() {
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl");
	const router = useRouter();
	const [loading, startTransition] = useTransition();
	const defaultValues = {
		email: "demo@gmail.com",
	};
	const form = useForm<UserFormValue>({
		resolver: zodResolver(formSchema),
		defaultValues,
	});

	const onSubmit = async (data: UserFormValue) => {
		console.log("DATA", data);
		startTransition(async () => {
			try {
				const response = await axios.post("/api/send-otp-email", {
					email: data.email,
				});

				// console.log("RESPONSE", response);

				const result = response.data;

				console.log("RESULT", result);

				if (result.success) {
					localStorage.setItem("otpToken", result.token);
					useOtpStore.getState().setOtp(result.otp);
					useOtpStore.getState().setToken(result.token);
					router.push(`/verify?email=${data.email}`);
					toast.success("A sign-in OTP has been sent to your email!");
					// await requestOtp(data.email);
				} else {
					toast.error("Failed to send the sign-in link. Please try again later.");
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
						Continue With Email
					</Button>
				</form>
			</Form>
			<div className="relative">
				<div className="absolute inset-0 flex items-center">
					<span className="w-full border-t" />
				</div>
				{/* <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div> */}
			</div>
			{/* <GithubSignInButton /> */}
		</>
	);
}
