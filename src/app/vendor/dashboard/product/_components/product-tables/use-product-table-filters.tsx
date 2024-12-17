"use client";

import { searchParams } from "@/lib/searchparams";
import { useQueryState } from "nuqs";
import { useCallback, useMemo } from "react";

export const CATEGORY_OPTIONS = [
	{ value: "fashion", label: "Fashion" },
	{ value: "Beauty Products", label: "Beauty Products" },
	{ value: "Electronics", label: "Electronics" },
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
