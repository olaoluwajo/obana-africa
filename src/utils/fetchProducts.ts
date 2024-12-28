interface SearchParams {
	page?: string;
	q?: string;
	limit?: string;
	categories?: string;
}

export const fetchProducts = async (vendorId: string, searchParams: SearchParams = {}) => {
	const url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-products`);
	url.searchParams.append("vendorId", vendorId);

	// Append optional search parameters
	Object.entries(searchParams).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			url.searchParams.append(key, value);
		}
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
