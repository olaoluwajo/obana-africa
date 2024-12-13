import { NextResponse } from "next/server";
import axios from "axios";
import { getInventoryAccessToken } from "@/helpers/zohoAuthToken";

export async function GET(request: Request) {
	const url = new URL(request.url);
	const vendorId = url.searchParams.get("vendorId");
	const page = parseInt(url.searchParams.get("page") || "1");
	const q = url.searchParams.get("q") || "";
	const limit = parseInt(url.searchParams.get("limit") || "10");
	const categories = url.searchParams.get("category_name") || "";

	if (!vendorId) {
		return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
	}

	try {
		const accessToken = await getInventoryAccessToken();
		let allVendorItems: any[] = [];
		let currentPage = page;
		const pageSize = limit; // Set page size as limit

		while (true) {
			const response = await axios.get("https://www.zohoapis.com/inventory/v1/items", {
				headers: {
					Authorization: `Zoho-oauthtoken ${accessToken}`,
				},
				params: {
					organization_id: process.env.ZOHO_ORG_ID,
					page: currentPage,
					per_page: pageSize,
					usestate: true,
					vendor_id: vendorId,
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
		}

		return NextResponse.json({ products: allVendorItems, total_products: allVendorItems.length });
	} catch (error: any) {
		return NextResponse.json(
			{ error: "Failed to fetch vendor items", message: error.message },
			{ status: 500 },
		);
	}
}
