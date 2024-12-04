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
		// Google Sheets Authentication
		const authClient = new JWT({
			email: GOOGLE_SERVICE_ACCOUNT_EMAIL,
			key: GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
			scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
		});

		// Load the Google Sheet data
		const doc = new GoogleSpreadsheet(String(SHEET_ID), authClient);
		await doc.loadInfo();
		const sheet = doc.sheetsByIndex[0];
		const rows = await sheet.getRows();

		// console.log("Loaded Google Sheet data:", rows);

		if (updatedRow < 1 || updatedRow > rows.length) {
			console.error(`Invalid row index: ${updatedRow}. Row does not exist.`);
			return null;
		}
		const updatedRowData = rows[(updatedRow = 1)];
		// console.log("Updated Row Data:", updatedRowData._updateRowNumber);

		// Fetch Zoho Inventory items
		const accessToken = await getAccessToken();
		const existingItemsResponse = await axios.get("https://www.zohoapis.com/inventory/v1/items", {
			headers: {
				Authorization: `Zoho-oauthtoken ${accessToken}`,
				"Content-Type": "application/json",
				"X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID,
			},
		});

		const existingItems: ZohoInventoryItem[] = existingItemsResponse.data.items || [];
		existingItems.forEach((item) => {
			console.log("SKU:", item.sku);
		});
		const existingItemMap = new Map(existingItems.map((item: any) => [item.sku, item]));

		// console.log(existingItemMap)

		// Prepare the payload to send to Zoho
		for (const row of rows) {
			// const payload = {
			// 	sku: updatedRowData.get("SKU"),
			// 	name: updatedRowData.get("Item Name"),
			// 	unit: updatedRowData.get("Unit"),
			// 	selling_price: parseFloat(updatedRowData.get("Selling Price")),
			// 	rate: parseFloat(updatedRowData.get("Price per Unit")),
			// };

			const payload = {
				sku: updatedRowData.get("SKU"),
				name: updatedRowData.get("Item Name"),
				unit: updatedRowData.get("Unit"),
				selling_price: parseFloat(updatedRowData.get("Selling Price")),

				sales_rate: 10000.0,
				purchase_rate: 1950.0,

				is_returnable: true,
				sample: updatedRowData.get("Sample Available"),
				size: updatedRowData.get("Sizes Run"),
				color: updatedRowData.get("Available Colors"),
				purchase_price: parseFloat(updatedRowData.get("Purchase Price")),
				price: parseFloat(updatedRowData.get("Purchase Price")),
				rate: parseFloat(updatedRowData.get("Price per Unit")),
				returnable: updatedRowData.get("Is Returnable Item"),
				brand: updatedRowData.get("Brand"),
				category_name: updatedRowData.get("Category"),
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
				attribute_option_name1: updatedRowData.get("Available Colors"),
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
				// stock_on_hand: parseInt(updatedRowData.get("Units per Box")),
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

			console.log("Prepared Payload:", payload.sku);
			console.log("Existing SKUs in Map:", Array.from(existingItemMap.keys()));

			if (existingItemMap.has(payload.sku)) {
				// Item exists in Zoho, check for modifications
				const existingItem = existingItemMap.get(payload.sku);
				console.log("Found existing item in Zoho:", existingItem);

				// Compare if any field has changed (you can add more fields for comparison)
				const isModified =
					existingItem.name !== payload.name ||
					existingItem.rate !== payload.rate ||
					existingItem.unit !== payload.unit;

				if (isModified) {
					// Update the item in Zoho
					console.log("Item modified, updating in Zoho...");
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
						console.log(`Updated item: ${payload.sku}`);
					} catch (error: any) {
						console.error("Error updating item:", error.response?.data || error.message);
					}
				} else {
					console.log(`No changes detected for item: ${payload.sku}`);
				}
			} else {
				// Item does not exist, create a new item in Zoho
				console.log("Item not found, creating new item...");
				try {
					await axios.post("https://www.zohoapis.com/inventory/v1/items", payload, {
						headers: {
							Authorization: `Zoho-oauthtoken ${accessToken}`,
							"Content-Type": "application/json",
							"X-com-zoho-inventory-organizationid": process.env.ZOHO_ORG_ID,
						},
					});
					console.log(`Created item: ${payload.sku}`);
				} catch (error: any) {
					console.error("Error creating item:", error.response?.data || error.message);
				}
			}
		}

		return rows;
	} catch (err) {
		console.error("Error syncing with Zoho:", err);
		return null;
	}
};
