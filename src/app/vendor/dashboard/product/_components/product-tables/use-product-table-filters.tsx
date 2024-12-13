"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export const CATEGORY_OPTIONS = [
	{ value: "Men", label: "Men" },
	{ value: "Women", label: "Women" },
	{ value: "fashion", label: "Fashion" },
	{ value: "T-shirts", label: "T-shirts" },
	{ value: "Shorts", label: "Shorts" },
	{ value: "Assesories", label: "Assesories" },
	{ value: "Sneakers", label: "Sneakers" },
	{ value: "Trousers", label: "Trousers" },
	{ value: "Polo", label: "Polo" },
	{ value: "Shirts", label: "Shirts" },
	{ value: "Hoodies", label: "Hoodies" },
	{ value: "Jackets", label: "Jackets" },
	{ value: "Smart Pants", label: "Smart Pants" },
	{ value: "Sweatshirts", label: "Sweatshirts" },
	{ value: "Beauty Products", label: "Beauty Products" },
	{ value: "Electronics", label: "Electronics" },
	{ value: "Headsets", label: "Headsets" },
];
export function useProductTableFilters() {
	const [searchQuery, setSearchQuery] = useQueryState(
		"q",
		searchParams.q.withOptions({ shallow: false, throttleMs: 1000 }).withDefault(""),
	);

	const [categoriesFilter, setCategoriesFilter] = useQueryState(
		"category",
		searchParams.categories.withOptions({ shallow: false }).withDefault(""),
	);
	const [page, setPage] = useQueryState("page", searchParams.page.withDefault(1));

	const resetFilters = useCallback(() => {
		setSearchQuery(null);
		setCategoriesFilter(null);

		setPage(1);
	}, [setSearchQuery, setCategoriesFilter, setPage]);

	const isAnyFilterActive = useMemo(() => {
		return !!searchQuery || !!categoriesFilter;
	}, [searchQuery, categoriesFilter]);

	console.log("categoriesFilter:", categoriesFilter);

	// Handle category selection change (optional custom function)
	const handleCategoryChange = (category: string) => {
		setCategoriesFilter(category);
		console.log("Category Filter Updated:", category);
	};

	return {
		searchQuery,
		setSearchQuery,
		page,
		setPage,
		resetFilters,
		isAnyFilterActive,
		categoriesFilter,
		setCategoriesFilter,
		handleCategoryChange,
	};
}
