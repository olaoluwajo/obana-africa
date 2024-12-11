"use client";

import useAuthStore from "@/stores/authStore";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const router = useRouter();
	const pathname = usePathname();
	const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);
	const role = useAuthStore((state: any) => state.role);

	useEffect(() => {
		// console.log("Authenticated:", isAuthenticated);
		// console.log("Role:", role);

		if (role === "vendor") {
			console.log("Redirecting to vendor dashboard...");
			router.push("/vendor/dashboard");
		} else if (role === "admin") {
			console.log("Redirecting to admin dashboard...");
			router.push("/admin/dashboard");
		} else {
			console.log("User is not authenticated, redirecting to sign-in page...");
			router.push("/auth/vendor/sign-in");
		}
	}, [isAuthenticated, role, router]);

	if (!isAuthenticated) return null;

	if (isAuthenticated && role === "vendor") return <div>{children}</div>;
}
