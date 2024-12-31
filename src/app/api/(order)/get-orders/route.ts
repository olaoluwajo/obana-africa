import { NextResponse } from "next/server";
import axios from "axios";
import { getSalesAccessToken } from "@/helpers/zohoAuthToken";

interface SalesOrder {
	id: string;
	item_id: any;
	search_text_formatted: any;
	search_text: any;
}

interface SearchCriteria {
	column_name: string;
	search_text: string;
	search_text_formatted: string;
	comparator: string;
}

interface PageContext {
	page: number;
	per_page: number;
	has_more_page: boolean;
	search_criteria?: SearchCriteria[];
}

interface ApiResponse {
	salesorders: SalesOrder[];
	page_context: PageContext;
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	const itemIdsParam = url.searchParams.get("itemIds");

	if (!itemIdsParam) {
		return NextResponse.json({ error: "Query parameter 'itemIds' is required" }, { status: 400 });
	}

	const itemIds = itemIdsParam.split(",");

	if (!Array.isArray(itemIds) || itemIds.length === 0) {
		return NextResponse.json({ error: "Invalid 'itemIds' query parameter" }, { status: 400 });
	}

	async function fetchSalesOrdersForItem(accessToken: string, itemId: string) {
		const salesOrders: SalesOrder[] = [];
		let searchCriteria: SearchCriteria[] = [];
		let currentPage = 1;

		while (true) {
			try {
				const response = await axios.get<ApiResponse>(
					"https://www.zohoapis.com/inventory/v1/salesorders",
					{
						headers: {
							Authorization: `Zoho-oauthtoken ${accessToken}`,
						},
						params: {
							organization_id: process.env.ZOHO_ORG_ID,
							item_id: itemId,
							page: currentPage,
						},
						timeout: 10000,
					},
				);


				const ordersWithItemId = response.data.salesorders.map((order) => ({
					...order,
					search_text: itemId,
				}));

				salesOrders.push(...ordersWithItemId);
				if (response.data.page_context?.search_criteria) {
					searchCriteria = response.data.page_context.search_criteria;
				}

				if (!response.data.page_context.has_more_page) break;

				currentPage++;
			} catch (error: any) {
				if (error.response?.status === 401) {
					const newAccessToken = await getSalesAccessToken();
					process.env.ZOHO_INVENTORY_SALES_TOKEN = newAccessToken;
					return await fetchSalesOrdersForItem(newAccessToken, itemId);
				} else {
					console.error(`Error fetching sales orders for item ${itemId}:`, error.message);
				}
				break;
			}
		}

		// Return both sales orders and search criteria
		return { salesOrders, searchCriteria };
	}

	try {
		let accessToken = process.env.ZOHO_INVENTORY_SALES_TOKEN;

		if (!accessToken) {
			accessToken = await getSalesAccessToken();
			process.env.ZOHO_INVENTORY_SALES_TOKEN = accessToken;
		}

		const allSalesOrders: SalesOrder[] = [];
		const allSearchCriteria: Record<string, string> = {}; // Map to store itemId -> item_name

		// Fetch sales orders for each itemId
		for (const itemId of itemIds) {
			const { salesOrders, searchCriteria } = await fetchSalesOrdersForItem(accessToken, itemId);
			if (salesOrders.length > 0) {
				allSalesOrders.push(...salesOrders);
				// Populate the map with item_id and item_name (formatted)
				searchCriteria.forEach((criteria) => {
					allSearchCriteria[criteria.search_text] = criteria.search_text_formatted;
				});
			}
		}
		// console.log("Search Criteria Map:", allSearchCriteria);
		// console.log("Sample Sales Order:", allSalesOrders[0]);

		// Attach item names to the sales orders
		const salesOrdersWithNames = allSalesOrders.map((order) => ({
			...order,
			item_name: allSearchCriteria[order.search_text] || "Unknown Item",
			item_id: order.search_text,
		}));

		console.log("salesOrdersWithNames", salesOrdersWithNames);

		// Send both the sales orders and search criteria to the frontend
		return NextResponse.json({
			salesOrders: salesOrdersWithNames,
			totalSalesOrders: salesOrdersWithNames.length,
			searchCriteria: allSearchCriteria,
		});
	} catch (error: any) {
		console.error("Error in fetching sales orders:", error.message);
		return NextResponse.json(
			{ error: "Failed to fetch sales orders", message: error.message },
			{ status: 500 },
		);
	}
}
