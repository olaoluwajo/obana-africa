import { NextResponse } from "next/server";
import axios from "axios";
import { getInventoryAccessToken } from "@/helpers/zohoAuthToken";

export async function GET(request: Request) {
	console.log('PRODUCT REQUEST',request)
	const url = new URL(request.url);
	const vendorId = url.searchParams.get("vendorId");
	const page = parseInt(url.searchParams.get("page") || "1");
	const q = url.searchParams.get("q") || "";
	const limit = parseInt(url.searchParams.get("limit") || "200");
	const categories = url.searchParams.get("category_name") || "";

	if (!vendorId) {
		return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
	}

	async function fetchVendorItems(accessToken: string): Promise<any[]> {
		let allVendorItems: any[] = [];
		// let currentPage = page;
		let currentPage = 1;
		const pageSize = limit;

		while (true) {
			try {
				const response = await axios.get("https://www.zohoapis.com/inventory/v1/items", {
					headers: {
						Authorization: `Zoho-oauthtoken ${accessToken}`,
					},
					params: {
						applied_filter: "Status.All",
						organization_id: process.env.ZOHO_ORG_ID,
						page: currentPage,
						per_page: 200,
						usestate: true,
						vendor_id: vendorId,
						sort_column: "created_time",
						sort_order: "D",
						search_criteria: q ? [{ column_name: "name", search_text: q }] : [],
						categories: categories,
					},
				});

				const items = response.data.items;
				if (items && items.length > 0) {
					allVendorItems = [...allVendorItems, ...items];
				}

				const hasMorePages = response.data.page_context?.has_more_page;
				if (!hasMorePages) break;
				currentPage++;
			} catch (error: any) {
				if (error.response?.status === 401) {
					console.warn("Access token expired. Refreshing...");
					const newAccessToken = await getInventoryAccessToken();
					process.env.ZOHO_INVENTORY_ACCESS_TOKEN = newAccessToken;
					return await fetchVendorItems(newAccessToken);
				} else {
					console.error("Error fetching vendor items:", error.message);
					throw new Error("Error fetching vendor items");
				}
			}
		}

		return allVendorItems;
	}

	try {
		let accessToken = process.env.ZOHO_INVENTORY_ACCESS_TOKEN;

		if (!accessToken) {
			accessToken = await getInventoryAccessToken();
			process.env.ZOHO_INVENTORY_ACCESS_TOKEN = accessToken;
		}

		const allVendorItems = await fetchVendorItems(accessToken);

		return NextResponse.json({ products: allVendorItems, total_products: allVendorItems.length });
	} catch (error: any) {
		return NextResponse.json(
			{ error: "Failed to fetch vendor items", message: error.message },
			{ status: 500 },
		);
	}
}
