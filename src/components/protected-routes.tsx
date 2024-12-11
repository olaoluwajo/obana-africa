"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const pathname = usePathname();
	const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/vendor/dashboard");

			if (pathname === "/") {
				router.push("/vendor/dashboard");
			}
		} else {
			router.push("/");
			if (pathname !== "/") {
				router.push("/");
			}
		}
	}, [isAuthenticated]);
	if (isAuthenticated) return <>{children}</>;
};

export default ProtectedRoute;
