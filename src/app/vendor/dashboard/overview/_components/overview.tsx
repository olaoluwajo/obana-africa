"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { BarGraph } from "./bar-graph";
// import { CalendarDateRangePicker } from '@/components/date-range-picker';
import PageContainer from "@/components/layout/page-container";
import RecentSales from "./recent-sales";
import FailedProducts from "./failed-products";
import RecentProducts from "./recent-products";
import Cookies from "js-cookie";
import { fetchProducts } from "@/utils/fetchProducts";

// import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useVendorStore } from "@/stores/useVendorStore";

export default function OverViewPage() {
	const [activeProducts, setActiveProducts] = useState(0);
	const vendorName = useVendorStore((state) => state.vendorName);
	const [isLoading, setIsLoading] = useState(true);

	if (!vendorName) {
		const vendorName = Cookies.get("vendorName");
		// console.log("VENDOR NAME", vendorName);
		useVendorStore.setState({ vendorName: vendorName });
	}
	const totalProducts = localStorage.getItem("productCount");
	// const totalProducts = Cookies.get("productCount");

	// Fetch active products count from API
	useEffect(() => {
		const fetchData = async () => {
			try {
				const storedVendorId = localStorage.getItem("vendorId");
				if (!storedVendorId) {
					throw new Error("Vendor ID not found in localStorage");
				}

				// Fetch all products
				const data = await fetchProducts(storedVendorId);

				// Extract products and count active ones
				const products = data.products || [];
				// console.log(products);

				// Count products with status "active"
				const activeProductsCount = products.filter(
					(product: any) => product.status === "active",
				).length;

				// Update state with active products count
				setActiveProducts(activeProductsCount);
			} catch (err) {
				console.error(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, []);

	return (
		<PageContainer scrollable>
			<div className="space-y-2 pb-5">
				<div className="flex items-center justify-between space-y-2">
					<h2 className="text-2xl font-bold tracking-tight text-card-foreground">
						{/* Hi, Welcome back {vendorName?.toLowerCase()} 👋 */}
						Hi, Welcome back{" "}
						{(vendorName?.[0]?.toUpperCase() ?? "") +
							(vendorName?.slice(1)?.toLowerCase() ?? "")}
						👋
					</h2>
				</div>
				<Tabs defaultValue="overview" className="space-y-4">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="analytics" disabled>
							Analytics
						</TabsTrigger>
					</TabsList>
					<TabsContent value="overview" className="space-y-4">
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground">
										<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">N0.00</div>
									<p className="text-xs text-muted-foreground">+0.0% from last month</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Products Upload</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground">
										<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
										<circle cx="9" cy="7" r="4" />
										<path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold"> {totalProducts}</div>
									<p className="text-xs text-muted-foreground">+180.1% from last month</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Sales</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground">
										<rect width="20" height="14" x="2" y="5" rx="2" />
										<path d="M2 10h20" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">+0</div>
									<p className="text-xs text-muted-foreground">+0% from last month</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">
										Active Now Products
									</CardTitle>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 24 24"
										fill="none"
										stroke="currentColor"
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										className="h-4 w-4 text-muted-foreground">
										<path d="M22 12h-4l-3 9L9 3l-3 9H2" />
									</svg>
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">+{activeProducts}</div>
									<p className="text-xs text-muted-foreground">+0 since last hour</p>
								</CardContent>
							</Card>
						</div>
						<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
							<Card className="col-span-4">
								<CardHeader>
									<CardTitle>Overview</CardTitle>
								</CardHeader>
								<CardContent className="pl-2">
									<BarGraph />
								</CardContent>
							</Card>
							<Card className="col-span-3">
								<CardHeader>
									<CardTitle>Recently Added Products</CardTitle>
								</CardHeader>
								<CardContent>
									<RecentProducts />
								</CardContent>
							</Card>
							<Card className="col-span-3">
								<CardHeader>
									<CardTitle>Recent Orders</CardTitle>
									<CardDescription>You made 0 sales this month.</CardDescription>
								</CardHeader>
								<CardContent>
									<RecentSales />
								</CardContent>
							</Card>
							<Card className="col-span-4">
								<CardHeader>
									<CardTitle>Recent Orders</CardTitle>
									<CardDescription>You have made 0 sales this month</CardDescription>
								</CardHeader>
								<CardContent>
									<FailedProducts />
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</PageContainer>
	);
}
