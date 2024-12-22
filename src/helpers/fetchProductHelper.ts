import axios from "axios";
import { getAccessToken } from "./zohoAuthToken";

export async function fetchProducts({
	page = 1,
	limit = 10,
	search = "",
	categories = "",
	vendorId = "",
}: {
	page?: number;
	limit?: number;
	search?: string;
	categories?: string;
	vendorId?: string;
}) {
	try {
		const accessToken = await getAccessToken();

		// Fetch all products from the Zoho API
		const response = await axios.get("https://www.zohoapis.com/inventory/v1/items", {
			headers: {
				Authorization: `Zoho-oauthtoken ${accessToken}`,
			},
			params: {
				page,
				per_page: limit,
				search_text: search,
				category: categories,
				organization_id: process.env.ZOHO_ORG_ID,
			},
		});

		if (response.status === 200) {
			const allProducts = response.data.items;

			// Filter products by vendorId
			const filteredProducts = allProducts.filter(
				(product: any) => product.vendor_id === vendorId,
			);

			return {
				products: filteredProducts,
				total_products: filteredProducts.length,
			};
		} else {
			throw new Error(`Error fetching products: ${response.data.message}`);
		}
	} catch (error: any) {
		if (error.response) {
			console.error("Zoho API Error:", error.response.data);
			throw new Error(error.response.data.message || "Zoho API error occurred");
		} else {
			console.error("Error fetching products:", error.message);
			throw new Error("Failed to fetch products");
		}
	}
}
