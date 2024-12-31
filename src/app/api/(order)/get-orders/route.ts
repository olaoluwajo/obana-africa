import { NextResponse } from "next/server";
import axios from "axios";
import { getSalesAccessToken } from "@/helpers/zohoAuthToken";

export const dynamic = "force-dynamic";

export async function GET() {
	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	async function fetchWithRetry(url: string, config: any, retries = 3) {
		let lastError;

		for (let i = 0; i < retries; i++) {
			try {
				const response = await axios.get(url, {
					...config,
					timeout: 15000,
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

	async function fetchAllSalesOrders(accessToken: string) {
		const salesOrders: any[] = [];
		let currentPage = 1;

		while (true) {
			try {
				const response = await fetchWithRetry(
					"https://www.zohoapis.com/inventory/v1/salesorders",
					{
						headers: {
							Authorization: `Zoho-oauthtoken ${accessToken}`,
						},
						params: {
							organization_id: process.env.ZOHO_ORG_ID,
							page: currentPage,
						},
					},
				);

				salesOrders.push(...response.data.salesorders);

				if (!response.data.page_context?.has_more_page) break;
				currentPage++;

				// Add a small delay between pages
				await delay(500);
			} catch (error: any) {
				if (error.response?.status === 401) {
					const newAccessToken = await getSalesAccessToken();
					process.env.ZOHO_INVENTORY_SALES_TOKEN = newAccessToken;
					return await fetchAllSalesOrders(newAccessToken);
				}
				console.error("Error fetching sales orders:", error.message);
				break;
			}
		}

		return salesOrders;
	}

	try {
		let accessToken = process.env.ZOHO_INVENTORY_SALES_TOKEN;

		if (!accessToken) {
			accessToken = await getSalesAccessToken();
			process.env.ZOHO_INVENTORY_SALES_TOKEN = accessToken;
		}

		const salesOrders = await fetchAllSalesOrders(accessToken);

		return NextResponse.json({
			salesOrders,
			totalSalesOrders: salesOrders.length,
		});
	} catch (error: any) {
		console.error("Error in fetching all sales orders:", error.message);
		return NextResponse.json(
			{ error: "Failed to fetch all sales orders", message: error.message },
			{ status: 500 },
		);
	}
}
