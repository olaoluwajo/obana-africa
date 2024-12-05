'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state: any) => state.isAuthenticated);

	useEffect(() => {
		if (isAuthenticated) {
			router.push("/dashboard");
		} else {
			router.push("/");
		}
	}, [isAuthenticated, router]);

	// if (!isAuthenticated) return null;

	return <>{children}</>;
};

export default ProtectedRoute;
