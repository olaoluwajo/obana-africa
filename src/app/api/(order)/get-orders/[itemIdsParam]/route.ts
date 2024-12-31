import { NextResponse } from "next/server";
import axios from "axios";
import { getSalesAccessToken } from "@/helpers/zohoAuthToken";
import NodeCache from "node-cache";

// Initialize cache with 15 minutes TTL
const cache = new NodeCache({ stdTTL: 900 });

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

export const dynamic = "force-dynamic";

// Configurable constants
const CONFIG = {
	BATCH_SIZE: 3,
	BATCH_DELAY: 1500,
	ITEMS_PER_PAGE: 200,
	MAX_RETRIES: 3,
	CACHE_TTL: 900,
	REQUEST_TIMEOUT: 45000,
} as const;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: Request, { params }: { params: { itemIdsParam: string } }) {
	if (!params.itemIdsParam) {
		return NextResponse.json({ error: "Item IDs parameter is required" }, { status: 400 });
	}

	const itemIds = params.itemIdsParam.split(",").filter(Boolean);
	if (itemIds.length === 0) {
		return NextResponse.json({ error: "Invalid item IDs parameter" }, { status: 400 });
	}

	// Check cache first
	const cacheKey = `salesOrders_${itemIds.sort().join(",")}`;
	const cachedData = cache.get(cacheKey);
	if (cachedData) {
		return NextResponse.json(cachedData);
	}

	async function fetchWithRetry(url: string, config: any, retries = CONFIG.MAX_RETRIES) {
		let lastError;

		for (let i = 0; i < retries; i++) {
			try {
				const response = await axios.get(url, {
					...config,
					timeout: CONFIG.REQUEST_TIMEOUT,
				});
				return response;
			} catch (error: any) {
				lastError = error;
				// console.log(`Retry ${i + 1} failed for URL: ${url}`, error.message);

				if (error.response?.status === 401) throw error;

				// Enhanced backoff strategy
				const backoffTime = Math.min(1000 * Math.pow(2, i), 10000);
				if (error.response?.status === 429) {
					await delay(backoffTime * 2);
					continue;
				}

				if (error.code === "ECONNABORTED" || error.response?.status === 504) {
					await delay(backoffTime);
					continue;
				}

				if (i === retries - 1) break;
				await delay(backoffTime);
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
							per_page: CONFIG.ITEMS_PER_PAGE,
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

				await delay(500); // Delay between pages
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

	function chunkArray<T>(array: T[], size: number): T[][] {
		return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
			array.slice(i * size, i + size),
		);
	}

	try {
		let accessToken = process.env.ZOHO_INVENTORY_SALES_TOKEN;

		if (!accessToken) {
			accessToken = await getSalesAccessToken();
			process.env.ZOHO_INVENTORY_SALES_TOKEN = accessToken;
		}

		const batches = chunkArray(itemIds, CONFIG.BATCH_SIZE);
		const allSalesOrders: SalesOrder[] = [];
		const allSearchCriteria: Record<string, string> = {};

		for (const [index, batch] of batches.entries()) {
			if (index > 0) {
				await delay(CONFIG.BATCH_DELAY);
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

		const response = {
			salesOrders: salesOrdersWithNames,
			totalSalesOrders: salesOrdersWithNames.length,
			searchCriteria: allSearchCriteria,
		};

		// Cache the successful response
		cache.set(cacheKey, response);

		return NextResponse.json(response);
	} catch (error: any) {
		console.error("Error in fetching sales orders:", error.message);
		return NextResponse.json(
			{ error: "Failed to fetch sales orders", message: error.message },
			{ status: 500 },
		);
	}
}
