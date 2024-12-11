import axios from "axios";
import { getAccessToken } from "./zohoAuthToken";

export default async function getVendorDetails(email: string) {
	const accessToken = await getAccessToken();

	let page = 1;
	let hasMorePages = true;
	let exists = false;

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

			const vendor = response.data.contacts.find((contact: any) => contact.email === email);
			// console.log("VENDOR", vendor);

			if (vendor) {
				return {
					exists: true,
					vendorId: vendor.contact_id,
				};
			}

			// console.log("VENDOR", vendor);

			// if (vendor) {
			// 	break;
			// }

			// Check if there are more pages
			hasMorePages = response.data.page_context.has_more_page;
			page++;
		}

		return { exists: false, vendorId: null };
	} catch (error: any) {
		console.error("Error checking vendor in Zoho:", error.message);
		throw new Error("Error checking vendor in Zoho");
	}
}
