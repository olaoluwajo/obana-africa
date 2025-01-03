"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { navItems } from "@/constants/data";
import {
	BadgeCheck,
	Bell,
	ChevronRight,
	ChevronsUpDown,
	CreditCard,
	LogOut,
	CircleUserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Icons } from "../icons";
import { toast } from "sonner";
import { useVendorStore } from "@/stores/useVendorStore";
import { useRouter } from "next/navigation";
import useAuthStore from "@/stores/authStore";

type IconType = keyof typeof Icons;

export default function AppSidebar() {
	const { vendorFirstName, vendorEmail: vendorEmailFromStore } = useVendorStore((state) => ({
		vendorFirstName: state.vendorFirstName,
		vendorEmail: state.vendorEmail,
	}));

	React.useEffect(() => {
		const storedFirstName = localStorage.getItem("vendorFirstName");
		const storedEmail = localStorage.getItem("vendorEmail");

		if (storedFirstName && storedFirstName !== vendorFirstName) {
			useVendorStore.getState().setVendorFirstName(storedFirstName);
		}
		if (storedEmail && storedEmail !== vendorEmailFromStore) {
			useVendorStore.getState().setVendorEmail(storedEmail);
		}
	}, [vendorFirstName, vendorEmailFromStore]);

	const router = useRouter();

	const pathname = usePathname();

	const handleLogout = () => {
		useVendorStore.getState().clearAll();
		useAuthStore.getState().clearAuth();
		router.push("/auth/vendor/sign-in");
		toast.success("You have been logged out successfully.");
	};

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<div className="flex gap-2 mt-4 ml-4 text-sidebar-accent-foreground   justify-start items-center">
					<div className="mt-4 flex">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<h1 className="text-white text-[28px]">Obana</h1>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className="overflow-x-hidden">
				<SidebarGroup>
					<SidebarGroupLabel>Overview</SidebarGroupLabel>
					<SidebarMenu>
						{navItems.map((item) => {
							const Icon = item.icon ? Icons[item.icon as IconType] : Icons.logo;
							return item?.items && item?.items?.length > 0 ? (
								<Collapsible
									key={item.title}
									asChild
									defaultOpen={item.isActive}
									className="group/collapsible">
									<SidebarMenuItem>
										<CollapsibleTrigger asChild>
											<SidebarMenuButton
												tooltip={item.title}
												isActive={pathname === item.url}>
												{item.icon && <Icon />}
												<span>{item.title}</span>
												<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
											</SidebarMenuButton>
										</CollapsibleTrigger>
										<CollapsibleContent>
											<SidebarMenuSub>
												{item.items?.map((subItem: any) => (
													<SidebarMenuSubItem key={subItem.title}>
														<SidebarMenuSubButton
															asChild
															isActive={pathname === subItem.url}>
															<Link href={subItem.url}>
																<span>{subItem.title}</span>
															</Link>
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</CollapsibleContent>
									</SidebarMenuItem>
								</Collapsible>
							) : (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										tooltip={item.title}
										isActive={pathname === item.url}>
										<Link href={item.url}>
											<Icon />
											<span>{item.title}</span>
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							);
						})}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton
									size="lg"
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ">
									<Avatar className="h-8 w-8 rounded-lg text-sidebar-accent-foreground">
										<AvatarImage
											src={vendorFirstName || ""}
											alt={vendorFirstName || ""}
										/>
										<AvatarFallback className="rounded-lg">
											{vendorFirstName?.slice(0, 2)?.toUpperCase() || "CN"}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{vendorFirstName || ""}
										</span>
										<span className="truncate text-xs">{vendorEmailFromStore || ""}</span>
										{/* <span className="truncate text-xs">{session?.user?.email || ""}</span> */}
									</div>
									<ChevronsUpDown className="ml-auto size-4" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
								side="bottom"
								align="end"
								sideOffset={4}>
								<DropdownMenuLabel className="p-0 font-normal">
									<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
										<Avatar className="h-8 w-8 rounded-lg">
											<AvatarImage
												src={vendorFirstName || ""}
												alt={vendorFirstName || ""}
											/>
											<AvatarFallback className="rounded-lg">
												{vendorFirstName?.slice(0, 2)?.toUpperCase() || "CN"}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{vendorFirstName || ""}
											</span>
											<span className="truncate text-xs">
												{vendorEmailFromStore || ""}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<DropdownMenuGroup>
									<DropdownMenuItem>
										<CircleUserRound />
										Profile
									</DropdownMenuItem>
									<DropdownMenuItem>
										<BadgeCheck />
										Account
									</DropdownMenuItem>
									<DropdownMenuItem>
										<CreditCard />
										Billing
									</DropdownMenuItem>
									<DropdownMenuItem>
										<Bell />
										Notifications
									</DropdownMenuItem>
								</DropdownMenuGroup>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={handleLogout}>
									<LogOut />
									Log out
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
