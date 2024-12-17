import axios from "axios";
import { getAccessToken } from "./zohoAuthToken";

export async function createProduct(vendorId: string, productData: any) {
	async function attemptCreateProduct(accessToken: string): Promise<any> {
		try {
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
			if (error.response?.status === 401) {
				console.warn("Access token expired. Refreshing...");
				// Refresh the token
				const newAccessToken = await getAccessToken();
				process.env.ZOHO_API_TOKEN = newAccessToken;
				return await attemptCreateProduct(newAccessToken);
			} else if (error.response) {
				const { code, message } = error.response.data;
				console.error("Zoho API Error:", error.response.data);
				throw new Error(`Failed to create product: ${message}`);
			} else {
				console.error("Error creating product:", error.message);
				throw new Error("Failed to create product: " + error.message);
			}
		}
	}

	try {
		// Get the initial access token
		let accessToken = process.env.ZOHO_API_TOKEN;

		if (!accessToken) {
			accessToken = await getAccessToken();
			process.env.ZOHO_API_TOKEN = accessToken;
		}

		return await attemptCreateProduct(accessToken);
	} catch (error: any) {
		console.error("Error in createProduct:", error.message);
		throw new Error(error.message);
	}
}
