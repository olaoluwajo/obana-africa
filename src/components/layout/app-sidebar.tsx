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
import { BadgeCheck, Bell, ChevronRight, ChevronsUpDown, CreditCard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Icons } from "../icons";
// import Image from 'next/image';

export const company = {
	name: "Acme Inc",
	logo: "/logo.webp",
	plan: "Enterprise",
};

type IconType = keyof typeof Icons;



export default function AppSidebar() {
	// const { data: session } = useSession();
	  const session = {
			user: {
				name: "John Doe",
				email: "john@example.com",
				image: "/path/to/profile-image.jpg",
			},
		};
	const pathname = usePathname();

	return (
		<Sidebar collapsible="icon">
			<SidebarHeader>
				<div className="flex gap-2 mt-4 ml-4 text-sidebar-accent-foreground   justify-start items-center">
					<div className="mt-4 flex">
						{/* <company.logo className="size-4" /> */}

						{/* <Image
              src={company.logo || '/logo.webp'}
              alt={`${company.name || 'Company'} logo`}
              width={170}
              height={170}
              className=""
              unoptimized
            />
             */}

						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img src="/logo.webp" alt="logo" className="w-[170px]" />
					</div>
					{/* <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{company.name}</span>
            <span className="truncate text-xs">{company.plan}</span>
          </div> */}
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
									className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
									<Avatar className="h-8 w-8 rounded-lg">
										<AvatarImage
											src={session?.user?.image || ""}
											alt={session?.user?.name || ""}
										/>
										<AvatarFallback className="rounded-lg">
											{session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
										</AvatarFallback>
									</Avatar>
									<div className="grid flex-1 text-left text-sm leading-tight">
										<span className="truncate font-semibold">
											{session?.user?.name || ""}
										</span>
										<span className="truncate text-xs">{session?.user?.email || ""}</span>
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
												src={session?.user?.image || ""}
												alt={session?.user?.name || ""}
											/>
											<AvatarFallback className="rounded-lg">
												{session?.user?.name?.slice(0, 2)?.toUpperCase() || "CN"}
											</AvatarFallback>
										</Avatar>
										<div className="grid flex-1 text-left text-sm leading-tight">
											<span className="truncate font-semibold">
												{session?.user?.name || ""}
											</span>
											<span className="truncate text-xs">
												{" "}
												{session?.user?.email || ""}
											</span>
										</div>
									</div>
								</DropdownMenuLabel>
								<DropdownMenuSeparator />

								<DropdownMenuGroup>
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
								<DropdownMenuItem>
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