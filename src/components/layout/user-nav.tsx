"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { signOut, useSession } from 'next-auth/react';
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";
import { toast } from "sonner";
import { useVendorStore } from "@/stores/useVendorStore";
import { useEffect } from "react";

export function UserNav() {
	const { vendorFirstName, vendorEmail: vendorEmailFromStore } = useVendorStore((state) => ({
		vendorFirstName: state.vendorFirstName,
		vendorEmail: state.vendorEmail,
	}));

	useEffect(() => {
		const storedFirstName = localStorage.getItem("vendorFirstName");
		const storedEmail = localStorage.getItem("vendorEmail");

		if (storedFirstName) useVendorStore.getState().setVendorFirstName(storedFirstName);
		if (storedEmail) useVendorStore.getState().setVendorEmail(storedEmail);
	}, []);

	const session = {
		user: {
			name: "John Doe",
			email: "john@example.com",
			image: "/path/to/profile-image.jpg",
		},
	};

	const router = useRouter();
	const setAuthenticated = useAuthStore((state) => state.setAuthenticated);

	// Logout handler
	const handleLogout = () => {
		// useVendorStore.getState().clearVendorId();
		// useVendorStore.getState().clearVendorName();
		useVendorStore.getState().clearAll();

		useAuthStore.getState().clearAuth();
		router.push("/auth/vendor/sign-in");
		toast.success("User logged out successfully.");
	};

	if (session) {
		return (
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar className="h-8 w-8 text-sidebar-accent-foreground">
							<AvatarImage src={vendorFirstName ?? ""} alt={vendorFirstName ?? ""} />
							<AvatarFallback>{vendorFirstName?.[0]}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className="w-56" align="end" forceMount>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{vendorFirstName}</p>
							<p className="text-xs leading-none text-muted-foreground">
								{vendorEmailFromStore}
							</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem>
							Profile
							<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							Billing
							<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
						</DropdownMenuItem>
						<DropdownMenuItem>
							Settings
							<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
						</DropdownMenuItem>
						{/* <DropdownMenuItem>New Team</DropdownMenuItem> */}
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleLogout}>
						Log out
						<DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
}
