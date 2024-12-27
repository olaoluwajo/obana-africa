"use client";

import { useState, useEffect, useMemo } from "react";
import { DataTable as ProductTable } from "@/components/ui/table/data-table";
import { columns } from "./product-tables/columns";
import Loader from "@/components/loader";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import { fetchProducts } from "@/utils/fetchProducts";

export default function RecentProductPage() {
	const [vendorId, setVendorId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [products, setProducts] = useState<any[]>([]);
	const [totalProducts, setTotalProducts] = useState<number>(0);

	// Memoized search parameters
	const searchParams = useMemo(
		() => ({
			page: "1",
			q: "",
			limit: "",
			categories: "",
		}),
		[],
	);

	useEffect(() => {
		const fetchData = async () => {
			try {
				if (typeof window !== "undefined") {
					const storedVendorId = localStorage.getItem("vendorId");
					if (!storedVendorId) {
						throw new Error("Vendor ID not found in localStorage");
					}

					setVendorId(storedVendorId);
					const data = await fetchProducts(storedVendorId, searchParams);
					setProducts(data.products || []);
					setTotalProducts(data.total_products || 0);
					localStorage.setItem("productCount", String(data.total_products || 0));
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "Unknown error");
			} finally {
				setIsLoading(false);
			}
		};

		fetchData();
	}, [searchParams]);

	if (isLoading) {
		return (
			<div className="text-card-foreground">
				<Loader fullscreen={false} />
			</div>
		);
	}

	if (error) {
		return <div>Error fetching products: {error}</div>;
	}

	return (
		<>
			{isLoading ? (
				<DataTableSkeleton columnCount={7} rowCount={10} />
			) : (
				<ProductTable columns={columns} data={products} totalItems={totalProducts} />
			)}
		</>
	);
}
