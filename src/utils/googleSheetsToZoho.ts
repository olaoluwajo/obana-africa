import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import axios from "axios";
import { getAccessToken } from "@/lib/zohoAuth";

interface ZohoInventoryItem {
	item_id: string;
	name: string;
	sku: string;
	rate: number;
	unit: number;
}

export const syncGoogleSheetsWithZoho = async () => {
	const { SHEET_ID, GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;

	if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY) {
		console.error("Missing Google service account credentials.");
		return null;
	}

	try {
		const authClient = new JWT({
			email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
			key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
		});

		const doc = new GoogleSpreadsheet(String(SHEET_ID), authClient);
		await doc.loadInfo();
		const sheet = doc.sheetsByIndex[0];
		const rows = await sheet.getRows();

		const accessToken = await getAccessToken();
		const existingItemsResponse = await axios.get("https://www.zohoapis.com/inventory/v1/items", {
			headers: {
				Authorization: `Zoho-oauthtoken ${accessToken}`,
				"Content-Type": "application/json",
				"X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID,
			},
		});
		const existingItems: ZohoInventoryItem[] = existingItemsResponse.data.items || [];
		const existingItemMap = new Map(existingItems.map((item: any) => [item.sku, item]));

		for (const row of rows) {
			const payload = {
				name: row.get("Item-Name"),
				sku: row.get("SKU"),
				rate: parseFloat(row.get("Price-per-Unit")),
				unit: parseInt(row.get("Units-per-Box")),
			};

			if (existingItemMap.has(row.get("SKU"))) {
				// Update existing item
				const existingItem = existingItemMap.get(row.get("SKU"));
				if (existingItem.name !== payload.name || existingItem.rate !== payload.rate || existingItem.unit !== payload.unit) {
					try {
						await axios.put(`https://www.zohoapis.com/inventory/v1/items/${existingItem.item_id}`, payload, {
							headers: {
								Authorization: `Zoho-oauthtoken ${accessToken}`,
								"Content-Type": "application/json",
								"X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID,
							},
						});
						console.log(`Updated item: ${payload.name}`);
					} catch (error: any) {
						console.error("Error updating item:", error.response?.data || error.message);
					}
				}
			} else {
				// Create new item
				try {
					await axios.post("https://www.zohoapis.com/inventory/v1/items", payload, {
						headers: {
							Authorization: `Zoho-oauthtoken ${accessToken}`,
							"Content-Type": "application/json",
							"X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID,
						},
					});
					console.log(`Created item: ${payload.name}`);
				} catch (error: any) {
					if (error.response) {
						console.error("Error sending data to Zoho Inventory:", error.response.data);
						console.error("Status Code:", error.response.status);
					} else if (error.request) {
						console.error("No response received:", error.request);
					} else {
						console.error("Error:", error.message);
					}
				}
			}
		}

		return rows;
	} catch (err) {
		console.error("Error fetching data from Google Sheets:", err);
	}
};
