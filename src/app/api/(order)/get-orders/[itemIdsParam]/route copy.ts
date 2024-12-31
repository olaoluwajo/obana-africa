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

// Changed to use route segment config
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: { itemIdsParam: string } }) {
	console.log("Received params:", params);

	const BATCH_SIZE = 5;
	const BATCH_DELAY = 1000;
	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	// Fixed params handling
	if (!params.itemIdsParam) {
		return NextResponse.json({ error: "Item IDs parameter is required" }, { status: 400 });
	}

	const itemIds = params.itemIdsParam.split(",").filter(Boolean);

	if (itemIds.length === 0) {
		return NextResponse.json({ error: "Invalid item IDs parameter" }, { status: 400 });
	}

	function chunkArray<T>(array: T[], size: number): T[][] {
		return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
			array.slice(i * size, i + size),
		);
	}

	async function fetchWithRetry(url: string, config: any, retries = 3) {
		let lastError;

		for (let i = 0; i < retries; i++) {
			try {
				const response = await axios.get(url, {
					...config,
					timeout: 30000,
				});
				return response;
			} catch (error: any) {
				lastError = error;

				if (error.response?.status === 401) throw error;

				if (error.response?.status === 429) {
					await delay(2000 * (i + 1));
					continue;
				}

				if (error.code === "ECONNABORTED" || error.response?.status === 504) {
					await delay(1000 * (i + 1));
					continue;
				}

				if (i === retries - 1) break;
				await delay(1000 * (i + 1));
			}
		}

		throw lastError;
	}

	async function fetchSalesOrdersForItem(accessToken: string, itemId: string) {
		const salesOrders: SalesOrder[] = [];
		let searchCriteria: SearchCriteria[] = [];
		let currentPage = 1;

		while (true) {
			try {
				const response: any = await fetchWithRetry(
					"https://www.zohoapis.com/inventory/v1/salesorders",
					{
						headers: {
							Authorization: `Zoho-oauthtoken ${accessToken}`,
						},
						params: {
							organization_id: process.env.ZOHO_ORG_ID,
							item_id: itemId,
							page: currentPage,
							per_page: 200,
						},
					},
				);

				const ordersWithItemId = response.data.salesorders.map((order: any) => ({
					...order,
					search_text: itemId,
				}));

				salesOrders.push(...ordersWithItemId);

				if (response.data.page_context?.search_criteria) {
					searchCriteria = response.data.page_context.search_criteria;
				}

				if (!response.data.page_context.has_more_page) break;
				currentPage++;

				// Add small delay between pages
				await delay(500);
			} catch (error: any) {
				if (error.response?.status === 401) {
					const newAccessToken = await getSalesAccessToken();
					process.env.ZOHO_INVENTORY_SALES_TOKEN = newAccessToken;
					return await fetchSalesOrdersForItem(newAccessToken, itemId);
				}
				console.error(`Error fetching sales orders for item ${itemId}:`, error.message);
				break;
			}
		}

		return { salesOrders, searchCriteria };
	}

	try {
		let accessToken = process.env.ZOHO_INVENTORY_SALES_TOKEN;

		if (!accessToken) {
			accessToken = await getSalesAccessToken();
			process.env.ZOHO_INVENTORY_SALES_TOKEN = accessToken;
		}

		const batches = chunkArray(itemIds, BATCH_SIZE);
		const allSalesOrders: SalesOrder[] = [];
		const allSearchCriteria: Record<string, string> = {};

		for (const [index, batch] of batches.entries()) {
			if (index > 0) {
				await delay(BATCH_DELAY);
			}

			const batchResults = await Promise.all(
				batch.map((itemId) => fetchSalesOrdersForItem(accessToken, itemId)),
			);

			for (const { salesOrders, searchCriteria } of batchResults) {
				if (salesOrders.length > 0) {
					allSalesOrders.push(...salesOrders);
					searchCriteria.forEach((criteria) => {
						allSearchCriteria[criteria.search_text] = criteria.search_text_formatted;
					});
				}
			}
		}

		const salesOrdersWithNames = allSalesOrders.map((order) => ({
			...order,
			item_name: allSearchCriteria[order.search_text] || "Unknown Item",
			item_id: order.search_text,
		}));

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
