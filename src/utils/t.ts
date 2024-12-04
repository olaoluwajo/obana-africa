import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import axios from "axios";
import { getAccessToken } from "@/helpers/zohoAuthToken";

interface ZohoInventoryItem {
	item_id: string;
	name: string;
	sku: string;
	rate: number;
	unit: number;
}

export const syncGoogleSheetsWithZoho = async (updatedRow: number) => {
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
		// const row = await sheet.getRow(updatedRow);

		const updatedRowData = rows[updatedRow - 1];

		const accessToken = await getAccessToken();
		const existingItemsResponse = await axios.get("https://www.zohoapis.com/inventory/v1/items", {
			headers: {
				Authorization: `Zoho-oauthtoken ${accessToken}`,
				"Content-Type": "application/json",
				"X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID,
			},
		});
		// console.log("Response items from Zoho Inventory:", existingItemsResponse.data.items);

		const existingItems: ZohoInventoryItem[] = existingItemsResponse.data.items || [];
		const existingItemMap = new Map(existingItems.map((item: any) => [item.sku, item]));
		// console.log("EXISTING ITEM 1", existingItemMap);
		// console.log("Service Account Email:", GOOGLE_SERVICE_ACCOUNT_EMAIL);
		// console.log("Private Key Present:", !!GOOGLE_PRIVATE_KEY);

		for (const row of rows) {
			const payload = {
				sku: row.get("SKU"),
				name: row.get("Item Name"),
				unit: row.get("Unit"),
				selling_price: parseFloat(row.get("Selling Price")),

				sales_rate: 10000.0,
				purchase_rate: 1950.0,

				is_returnable: true,
				sample: row.get("Sample Available"),
				size: row.get("Sizes Run"),
				color: row.get("Available Colors"),
				purchase_price: parseFloat(row.get("Purchase Price")),
				price: parseFloat(row.get("Purchase Price")),
				rate: parseFloat(row.get("Price per Unit")),
				returnable: row.get("Is Returnable Item"),
				brand: row.get("Brand"),
				category_name: row.get("Category"),
				item_type: "inventory",
				group_id: "4650667000000093429",
				// group_name: "MEN",
				purchase_description: "Purchase information description",

				manufacturer: "manufacturer",
				pricebook_rate: 10000.0,
				attribute_name1: "COLOUR",
				attribute_name2: "SIZE",
				attribute_name3: "TAGS",

				description: "Sales Information description",
				vendor_id: "4650667000000093341",
				// vendor_name: "FAZSION WHOLESALE",
				attribute_option_name1: "GREEN",
				attribute_option_name2: "S-XL",
				attribute_option_name3: "TANKTOP",

				stock_on_hand: 6.0,
				available_stock: 1.0,

				actual_available_stock: 14.0,
				committed_stock: 2.0,
				actual_committed_stock: 8.0,
				available_for_sale_stock: 1.0,
				actual_available_for_sale_stock: 6.0,

				product_type: "goods",
				purchase_account_name: "Cost of Goods Sold",
				account_name: "Sales",
				// stock_on_hand: parseInt(row.get("Units per Box")),
				// stock_on_hand: 50,
				// available_stock: 2,
				// actual_available_stock: 2,
				inventory_summary: {
					qty_to_be_shipped: 0.0,
					qty_to_be_received: 0.0,
					qty_to_be_invoiced: 0.0,
					qty_to_be_billed: 5.0,
				},
			};

			console.log("PAYLOAD :", payload);
			if (existingItemMap.has(payload.sku)) {
				console.log("PAYLOAD SKU:", payload);
				// Update existing item
				const existingItem = existingItemMap.get(payload.sku);
				console.log("Found existing item in Zoho to be updated:", existingItem);

				if (
					existingItem.name !== payload.name ||
					existingItem.rate !== payload.rate ||
					existingItem.unit !== payload.unit
				) {
					console.log("Updating item:", payload.name);
					try {
						await axios.put(
							`https://www.zohoapis.com/inventory/v1/items/${existingItem.item_id}`,
							payload,
							{
								headers: {
									Authorization: `Zoho-oauthtoken ${accessToken}`,
									"Content-Type": "application/json",
									"X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID,
								},
							},
						);
						console.log(`Updated item: ${payload.name}`);
					} catch (error: any) {
						console.error("Error updating item:", error.response?.data || error.message);
					}
				} else {
					console.log(`No changes detected for item: ${payload.name}`);
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
					if (error.response && error.response.data?.code === 1001) {
						// Handle conflict error (item already exists)
						console.warn(
							`Item with SKU ${payload.sku} already exists. Attempting to update.`,
						);
						const existingItem = existingItemMap.get(payload.sku);
						console.log("EXISTING ITEM 2", existingItem);

						if (existingItem) {
							// Try updating the existing item
							try {
								await axios.put(
									`https://www.zohoapis.com/inventory/v1/items/${existingItem.item_id}`,
									payload,
									{
										headers: {
											Authorization: `Zoho-oauthtoken ${accessToken}`,
											"Content-Type": "application/json",
											"X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID,
										},
									},
								);
								console.log(`Updated existing item on conflict: ${payload.name}`);
							} catch (updateError: any) {
								console.error(
									"Error updating item after conflict:",
									updateError.response?.data || updateError.message,
								);
							}
						} else {
							console.error(
								`Conflict detected, but could not find existing item with SKU ${payload.sku}`,
							);
						}
					} else if (error.response) {
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
