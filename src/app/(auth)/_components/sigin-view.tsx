import { Metadata } from "next";
import Link from "next/link";
import UserAuthForm from "./user-auth-form";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "Authentication",
	description: "Authentication page",
};

export default function SignInViewPage() {
	return (
		<div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-1  lg:px-0 bg-[#dcfbf9]">
			<Link
				href="/examples/authentication"
				className={cn(
					buttonVariants({ variant: "ghost" }),
					"absolute right-4 top-4 hidden md:right-8 md:top-8 text-white",
				)}>
				Login
			</Link>

			<div className="flex h-full items-center p-4 lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] shadow-md  rounded-md p-12 items-center bg-white">
					<img src="/logo.png" alt="" className="md:w-[70%] w-[50%] mb-2" />
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">VENDOR LOGIN</h1>
						<p className="text-sm text-muted-foreground">
							Enter your email below to login to your account
						</p>
					</div>
					<UserAuthForm />
					<p className="px-8 text-center text-sm text-muted-foreground">
						Dont have an account?{" "}
						<Link href="/sign-up" className="font-bold">
							Sign up
						</Link>
					</p>
					<p className="px-8 text-center text-sm text-muted-foreground">
						By clicking continue, you agree to our{" "}
						<Link href="/" className="underline underline-offset-4 hover:text-primary">
							Terms of Service
						</Link>{" "}
						and{" "}
						<Link href="/" className="underline underline-offset-4 hover:text-primary">
							Privacy Policy
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
}
