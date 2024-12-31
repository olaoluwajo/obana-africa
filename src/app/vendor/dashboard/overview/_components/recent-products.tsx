"use client";

import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, useMemo } from "react";
import { fetchProducts } from "@/utils/fetchProducts";
import Loader from "@/components/loader";

const RecentProducts = () => {
	const [products, setProducts] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [vendorId, setVendorId] = useState<string | null>(null);

	// Memoized search parameters
	const searchParams = useMemo(
		() => ({
			page: "1",
			q: "",
			limit: "10",
			categories: "",
		}),
		[],
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const storedVendorId = localStorage.getItem("vendorId");
				if (!storedVendorId) {
					throw new Error("Vendor ID not found in localStorage");
				}

				setVendorId(storedVendorId);
				const data = await fetchProducts(storedVendorId, searchParams);
				setProducts(data.products?.slice(0, 7) || []);
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [searchParams]);

	const formatPriceToNaira = (price: number) => {
		return `₦${price.toLocaleString("en-NG", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		})}`;
	};

	if (error) {
		return <div className="text-red-500">Error loading recent products: {error}</div>;
	}

	return (
		<>
			{isLoading ? (
				<Loader fullscreen={false} />
			) : (
				<Table>
					<TableCaption>A list of your recently uploaded products.</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead>Product name</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Quantity</TableHead>
							<TableHead className="text-right">Price</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{products.map((product: any) => (
							<TableRow key={product.id} className="text-xs">
								<TableCell className="font-medium">{product.name}</TableCell>
								<TableCell>
									<Badge variant={product.status === "active" ? "active" : "destructive"}>
										{product.status === "active" ? "Active" : "In-active"}
									</Badge>
								</TableCell>
								<TableCell>{product.stock_on_hand}</TableCell>
								<TableCell className="text-right">
									{formatPriceToNaira(product.rate)}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
};

export default RecentProducts;
