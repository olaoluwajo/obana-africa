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
			router.push("/dashboard");

			if (pathname === "/") {
				router.push("/dashboard");
			}
		} else {
			router.push("/");
			if (pathname !== "/") {
				router.push("/");
			}
		}
	}, [isAuthenticated, router]);

	return <>{children}</>;
};

export default ProtectedRoute;
