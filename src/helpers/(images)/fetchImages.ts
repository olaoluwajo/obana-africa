// import axios from "axios";
// import { getInventoryAccessToken } from "../zohoAuthToken";

// export async function fetchItemDetails(itemId: string) {
// 	try {
// 		const accessToken = await getInventoryAccessToken();

// 		const response = await axios.get(`https://www.zohoapis.com/inventory/v1/items/${itemId}`, {
// 			headers: {
// 				Authorization: `Zoho-oauthtoken ${accessToken}`,
// 			},
// 			params: {
// 				organization_id: process.env.ZOHO_ORG_ID,
// 			},
// 		});

// 		return response.data.item;
// 	} catch (error: any) {
// 		if (error.response) {
// 			throw new Error(error.response.data.message);
// 		}
// 		throw new Error("Error fetching item details");
// 	}
// }
