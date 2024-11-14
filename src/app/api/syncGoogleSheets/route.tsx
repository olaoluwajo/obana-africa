import { syncGoogleSheetsWithZoho } from "@/utils/googleSheetsToZoho";

export async function POST(req: any, res: any) {
	try {
		// console.log("Updated Row:", req.test);
		const { updatedRow } = req.body;

		// Process the data (e.g., use the data to sync with Zoho)
		console.log("Updated Row:", updatedRow);
		// console.log("Updated Values:", updatedValues);

		await syncGoogleSheetsWithZoho(updatedRow);

		return new Response(JSON.stringify({ status: "Data synced successfully" }), { status: 200 });
	} catch (error) {
		console.error("Error syncing data:", error);
		return new Response(JSON.stringify({ error: "Data sync failed" }), { status: 500 });
	}
}

// export async function GET(req: any) {
// 	try {
// 		const data = await fetchDataAndSendToZoho();

// 		return new Response(JSON.stringify({ status: "Data fetched successfully", data }), { status: 200 });
// 	} catch (error) {
// 		console.error("Error fetching data:", error);
// 		return new Response(JSON.stringify({ error: "Data fetch failed" }), { status: 500 });
// 	}
// }
