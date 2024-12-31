interface SearchParams {
	page: string;
	q: string;
	limit: string;
	categories: string;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchProducts = async (vendorId: string, searchParams: SearchParams) => {
	// console.log("Fetching products from API...");
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

export async function fetchProductById(productId: string) {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-products/${productId}`,
			{
				method: "GET",
			},
		);

		if (!response.ok) {
			throw new Error("Failed to fetch product");
		}

		return await response.json();
	} catch (error) {
		console.error("Error fetching product:", error);
		throw error;
	}
}
