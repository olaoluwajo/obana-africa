"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable as ProductTable } from "@/components/ui/table/data-table";
import { columns } from "./product-tables/columns";
import Loader from "@/components/loader";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";

interface SearchParams {
	page: string;
	q: string;
	limit: string;
	categories: string;
}

const fetchProducts = async (vendorId: string, searchParams: SearchParams) => {
	console.log("Fetching products from API...");
	const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-products`);
	url.searchParams.append("vendorId", vendorId);
	Object.keys(searchParams).forEach((key) => {
		url.searchParams.append(key, searchParams[key as keyof SearchParams]);
	});

	const response = await fetch(url.toString(), {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!response.ok) {
		throw new Error("Failed to fetch products");
	}

	return response.json();
};

export default function ProductListingPage() {
	const [vendorId, setVendorId] = useState<string | null>(null);
	const [isVendorIdLoaded, setVendorIdLoaded] = useState(false);

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
		if (typeof window !== "undefined") {
			const storedVendorId = localStorage.getItem("vendorId");
			setVendorId(storedVendorId);
			setVendorIdLoaded(true);
		}
	}, []);

	// Use React Query
	const { data, isLoading, error, isFetching, isStale } = useQuery({
		queryKey: ["products", vendorId, searchParams],
		queryFn: () => fetchProducts(vendorId!, searchParams),
		enabled: isVendorIdLoaded && !!vendorId,
		staleTime: 1000 * 60 * 5,
	});

	// Debugging logs
	useEffect(() => {
		console.log("Query isFetching:", isFetching);
		console.log("Query isStale:", isStale);
	}, [isFetching, isStale]);

	// Error state
	if (error) {
		return (
			<div>
				Error fetching products: {error instanceof Error ? error.message : "Unknown error"}
			</div>
		);
	}

	// Loading state
	if (isLoading || !vendorId) {
		return (
			<div className="text-card-foreground">
				<Loader />
			</div>
		);
	}

	const products = data?.products || [];
	const totalProducts = data?.total_products || 0;

	return (
		<>
			<Suspense fallback={<DataTableSkeleton columnCount={7} rowCount={10} />}>
				<ProductTable columns={columns} data={products} totalItems={totalProducts} />;
			</Suspense>
		</>
	);
}
