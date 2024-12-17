import { NextResponse } from "next/server";
import axios from "axios";
import { getInventoryAccessToken } from "@/helpers/zohoAuthToken";

export async function GET(request: Request, { params }: { params: { productId: string } }) {
	const { productId } = params;

	if (!productId) {
		return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
	}

	try {
		// Fetch the access token
		let accessToken = process.env.ZOHO_INVENTORY_ACCESS_TOKEN;

		if (!accessToken) {
			accessToken = await getInventoryAccessToken();
			process.env.ZOHO_INVENTORY_ACCESS_TOKEN = accessToken;
		}

		// Call Zoho API to fetch product details
		const response = await axios.get(`https://www.zohoapis.com/inventory/v1/items/${productId}`, {
			headers: {
				Authorization: `Zoho-oauthtoken ${accessToken}`,
			},
			params: {
				organization_id: process.env.ZOHO_ORG_ID,
			},
		});

		// Return the product details
		return NextResponse.json(response.data);
	} catch (error: any) {
		if (error.response?.status === 401) {
			console.warn("Access token expired. Refreshing...");
			const newAccessToken = await getInventoryAccessToken();
			process.env.ZOHO_INVENTORY_ACCESS_TOKEN = newAccessToken;

			// Retry fetching the product details with the new token
			return GET(request, { params });
		}

		console.error("Error fetching product details:", error.message);
		return NextResponse.json(
			{ error: "Failed to fetch product details", message: error.message },
			{ status: 500 },
		);
	}
}
