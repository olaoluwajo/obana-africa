import axios from "axios";
import { getAccessToken } from "./zohoAuthToken";

export default async function checkIfVendorExists(email: string) {
	const accessToken = await getAccessToken();

	let page = 1;
	let hasMorePages = true;
	let vendorExists = false;

	try {
		while (hasMorePages) {
			const response = await axios.get(`https://www.zohoapis.com/inventory/v1/contacts`, {
				headers: {
					Authorization: `Zoho-oauthtoken ${accessToken}`,
					"Content-Type": "application/json",
				},
				params: {
					organization_id: process.env.ZOHO_ORG_ID,
					contact_type: "vendor",
					page: page,
				},
			});

			// Check if the vendor exists on the current page
			vendorExists = response.data.contacts.some((contact: any) => contact.email === email);

			if (vendorExists) {
				break;
			}

			// Check if there are more pages
			hasMorePages = response.data.page_context.has_more_page;
			page++;
		}

		return vendorExists;
	} catch (error: any) {
		console.error("Error checking vendor in Zoho:", error.message);
		throw new Error("Error checking vendor in Zoho");
	}
}
