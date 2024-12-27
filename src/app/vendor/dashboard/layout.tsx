import { cookies } from "next/headers";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/layout/app-sidebar";
import Header from "@/components/layout/header";
import type { Metadata } from "next";
import ClientLayout from "./ClientLayout";

export const metadata: Metadata = {
	title: "Dashboard Overview",
	description: "Vendor dashboard",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	const cookieStore = cookies();
	const defaultOpen = cookieStore.get("sidebar:state")?.value === "true";

	return (
		<ClientLayout defaultOpen={defaultOpen}>
			<SidebarProvider defaultOpen={defaultOpen}>
				<AppSidebar />
				<SidebarInset>
					<Header />
					{children}
				</SidebarInset>
			</SidebarProvider>
		</ClientLayout>
	);
}
