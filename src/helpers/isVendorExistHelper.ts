import axios from "axios";
import { getAccessToken } from "./zohoAuthToken";

export default async function getVendorDetails(email: string) {
	let page = 1;
	let hasMorePages = true;
	let exists = false;

	// Function to fetch vendor details with retry logic
	async function fetchVendorDetails(accessToken: string): Promise<any> {
		while (hasMorePages) {
			try {
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

				if (vendor) {
					console.log("VENDOR FOUND", vendor);
					return {
						exists: true,
						vendorId: vendor.contact_id,
						vendorName: vendor.contact_name,
						contactName: vendor.vendor_name,
						firstName: vendor.first_name,
						lastName: vendor.last_name,
						vendorEmail: vendor.email,
						phone: vendor.phone,
					};
				}

				// Check if there are more pages
				hasMorePages = response.data.page_context.has_more_page;
				page++;
			} catch (error: any) {
				if (error.response?.status === 401) {
					// If 401, refresh the token and retry
					console.warn("Access token expired. Refreshing...");
					const newAccessToken = await getAccessToken();
					process.env.ZOHO_API_TOKEN = newAccessToken;
					console.log("New access token", newAccessToken);
					return await fetchVendorDetails(newAccessToken);
				} else {
					console.error("Error checking vendor in Zoho:", error.message);
					throw new Error("Error checking vendor in Zoho");
				}
			}
		}
		return { exists: false, vendorId: null };
	}

	try {
		const accessToken = process.env.ZOHO_API_TOKEN;
		if (!accessToken) {
			throw new Error(
				"ZOHO_API_TOKEN is not defined. Please ensure it is set in the environment variables.",
			);
		}
		return await fetchVendorDetails(accessToken);
	} catch (error: any) {
		console.error(error.message);
		throw new Error(error.message);
	}
}
