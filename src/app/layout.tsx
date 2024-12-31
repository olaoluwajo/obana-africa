import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import NextTopLoader from "nextjs-toploader";
// import ProtectedRoute from "@/components/protected-routes";

export const metadata: Metadata = {
	title: "Vendor.obana.africa",
	description: "Vendor Sign Up",
	icons: {
		icon: "/favicon.png",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning={true}>
			<body className={`antialiased`}>
				<NextTopLoader showSpinner={false} />
				<Toaster richColors duration={5000} />
				{children}
			</body>
		</html>
	);
}
