import { NextResponse } from "next/server";
import axios from "axios";
import { getAccessToken } from "@/helpers/zohoAuthToken";

export async function GET(request: Request, { params }: { params: { vendorId: string } }) {
	const { vendorId } = params;

	if (!vendorId) {
		return NextResponse.json({ error: "Vendor ID is required" }, { status: 400 });
	}

	try {
		// Fetch the access token
		let accessToken = process.env.ZOHO_INVENTORY_ACCESS_TOKEN;

		if (!accessToken) {
			accessToken = await getAccessToken();
			process.env.ZOHO_INVENTORY_ACCESS_TOKEN = accessToken;
		}

		// Call Zoho API to fetch vendor details
		const response = await axios.get(
			`https://www.zohoapis.com/inventory/v1/contacts/${vendorId}`,
			{
				headers: {
					Authorization: `Zoho-oauthtoken ${accessToken}`,
				},
				params: {
					organization_id: process.env.ZOHO_ORG_ID,
				},
			},
		);

		// Return the vendor details
		console.log("VENDOR INFO", response.data);
		return NextResponse.json(response.data);
	} catch (error: any) {
		if (error.response?.status === 401) {
			// console.warn("Access token expired. Refreshing...");
			const newAccessToken = await getAccessToken();
			process.env.ZOHO_INVENTORY_ACCESS_TOKEN = newAccessToken;

			// Retry fetching the vendor details with the new token
			return GET(request, { params });
		}

		console.error("Error fetching vendor details:", error.message);
		return NextResponse.json(
			{ error: "Failed to fetch vendor details", message: error.message },
			{ status: 500 },
		);
	}
}
