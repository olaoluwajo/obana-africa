import { NextResponse } from "next/server";
import axios from "axios";
import { getInventoryAccessToken } from "@/helpers/zohoAuthToken";

export async function POST(request: Request) {
	try {
		const { itemId, currentStatus } = await request.json();

		if (!itemId || typeof currentStatus === "undefined") {
			return NextResponse.json(
				{ error: "Item ID and current status are required" },
				{ status: 400 },
			);
		}

		// Get access token from environment or refresh if expired
		let accessToken = process.env.ZOHO_INVENTORY_ACCESS_TOKEN;

		if (!accessToken) {
			accessToken = await getInventoryAccessToken();
			process.env.ZOHO_INVENTORY_ACCESS_TOKEN = accessToken;
		}

		// Function to toggle item status
		async function toggleItemStatus(token: string): Promise<any> {
			try {
				const statusEndpoint =
					currentStatus === "active"
						? `https://www.zohoapis.com/inventory/v1/items/${itemId}/inactive`
						: `https://www.zohoapis.com/inventory/v1/items/${itemId}/active`;

				const response = await axios.post(
					statusEndpoint,
					{},
					{
						headers: {
							Authorization: `Zoho-oauthtoken ${token}`,
						},
						params: { organization_id: process.env.ZOHO_ORG_ID },
					},
				);

				return response.data;
			} catch (error: any) {
				if (error.response?.status === 401) {
					console.warn("Access token expired. Refreshing...");
					const newAccessToken = await getInventoryAccessToken();
					process.env.ZOHO_INVENTORY_ACCESS_TOKEN = newAccessToken;
					return await toggleItemStatus(newAccessToken);
				} else {
					console.error("Error toggling item status:", error.message);
					throw new Error("Failed to toggle item status");
				}
			}
		}

		const result = await toggleItemStatus(accessToken);

		return NextResponse.json({ success: true, data: result });
	} catch (error: any) {
		return NextResponse.json(
			{ error: "Failed to toggle item status", message: error.message },
			{ status: 500 },
		);
	}
}
