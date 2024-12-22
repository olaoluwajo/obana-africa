import axios from "axios";
import { getAccessToken } from "./zohoAuthToken";

export async function editProduct(productId: string, productData: any) {
	async function attemptEditProduct(accessToken: string): Promise<any> {
		try {
			const response = await axios.put(
				`https://www.zohoapis.com/inventory/v1/items/${productId}`,
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
				const newAccessToken = await getAccessToken();
				process.env.ZOHO_API_TOKEN = newAccessToken;
				return await attemptEditProduct(newAccessToken);
			} else if (error.response) {
				const { code, message } = error.response.data;
				console.error("Zoho API Error:", error.response.data);
				throw new Error(`Failed to edit product: ${message}`);
			} else {
				console.error("Error editing product:", error.message);
				throw new Error("Failed to edit product: " + error.message);
			}
		}
	}

	try {
		let accessToken = process.env.ZOHO_API_TOKEN;

		if (!accessToken) {
			accessToken = await getAccessToken();
			process.env.ZOHO_API_TOKEN = accessToken;
		}

		return await attemptEditProduct(accessToken);
	} catch (error: any) {
		console.error("Error in editProduct:", error.message);
		throw new Error(error.message);
	}
}
