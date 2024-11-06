import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Vendor.obana.africa",
	description: "Vendor Sign Up",
	icons: {
		icon: "/favicon.jpg",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`antialiased`}>{children}</body>
		</html>
	);
}
