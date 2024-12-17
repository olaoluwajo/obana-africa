// import axios from "axios";
// import FormData from "form-data";
// import fs from "fs";
// import { getInventoryAccessToken } from "../zohoAuthToken";
// export async function uploadItemImage(itemId: string, imagePath: string) {
// 	try {
// 		const accessToken = await getInventoryAccessToken();

// 		// Prepare the form data
// 		const formData = new FormData();
// 		formData.append("image", fs.createReadStream(imagePath)); // Replace `imagePath` with the actual image path
// 		formData.append("organization_id", process.env.ZOHO_ORG_ID!);

// 		// Post image to Zoho
// 		const response = await axios.post(
// 			`https://inventory.zoho.com/api/v1/items/${itemId}/images`,
// 			formData,
// 			{
// 				headers: {
// 					Authorization: `Zoho-oauthtoken ${accessToken}`,
// 					...formData.getHeaders(),
// 				},
// 			},
// 		);

// 		return response.data; // Includes the response for the uploaded image
// 	} catch (error: any) {
// 		if (error.response) {
// 			throw new Error(error.response.data.message);
// 		}
// 		throw new Error("Error uploading item image");
// 	}
// }
