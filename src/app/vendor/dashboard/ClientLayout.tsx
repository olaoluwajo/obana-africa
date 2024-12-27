"use client"; 

import { useEffect, useState } from "react";
import KBar from "@/components/kbar";

export default function ClientLayout({
	children,
	defaultOpen,
}: {
	children: React.ReactNode;
	defaultOpen: boolean;
}) {
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	if (!isClient) return null;

	return (
		<KBar>
			<div>{children}</div>
		</KBar>
	);
}
