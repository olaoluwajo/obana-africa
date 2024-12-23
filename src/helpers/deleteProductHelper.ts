import axios from "axios";
import { getAccessToken } from "@/helpers/zohoAuthToken";

export async function attemptDeleteProduct(accessToken: string, productId: string) {
	try {
		const response = await axios.delete(
			`https://www.zohoapis.com/inventory/v1/items/${productId}`,
			{
				headers: {
					Authorization: `Zoho-oauthtoken ${accessToken}`,
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
			return await attemptDeleteProduct(newAccessToken, productId);
		} else if (error.response) {
			const { code, message } = error.response.data;
			console.error("Zoho API Error:", error.response.data);
			throw new Error(`Failed to delete product: ${message}`);
		} else {
			console.error("Error deleting product:", error.message);
			throw new Error("Failed to delete product: " + error.message);
		}
	}
}
