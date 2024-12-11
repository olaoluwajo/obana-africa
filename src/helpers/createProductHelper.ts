import axios from "axios";
import { getAccessToken } from "./zohoAuthToken";

export async function createProduct(vendorId: string, productData: any) {
	try {
		const accessToken = await getAccessToken();
		console.log("Raw Product Data (Before Formatting):", productData);

		// Log formatted data before sending to Zoho
		console.log("Formatted Product Data (To be sent to Zoho):", {
			...productData,
			vendorId,
		});

		const response = await axios.post(
			`https://www.zohoapis.com/inventory/v1/items`,
			productData,
			{
				headers: {
					Authorization: `Zoho-oauthtoken ${accessToken}`,
					"Content-Type": "application/json",
				},
				params: {
					organization_id: process.env.ZOHO_ORG_ID,
				},
			},
		);

		return response.data;
	} catch (error: any) {
		if (error.response) {
			console.error("Zoho API Error:", error.response.data);
			const { code, message } = error.response.data;
			console.log("code", code);
			console.log("message", message);
			throw new Error(`Failed to create product: ${message}`);
		} else {
			console.error("Error creating product:", error.message);
			throw new Error("Failed to create product", error.message);
		}
	}
}
