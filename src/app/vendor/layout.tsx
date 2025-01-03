"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5000,
				gcTime: 300000,
				refetchOnMount: false,
				refetchOnWindowFocus: false,
				retry: 1,
			},
		},
	});

	useEffect(() => {
		if (role === "vendor") {
			router.push(window.location.pathname);
		} else if (role === "admin") {
			router.push("/admin/dashboard");
		} else {
			router.push("/auth/vendor/sign-in");
		}
	}, [isAuthenticated, role, router]);

	if (!isAuthenticated) return null;

	if (isAuthenticated && role === "vendor")
		return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
