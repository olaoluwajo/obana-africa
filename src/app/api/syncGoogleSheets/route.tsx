import { syncGoogleSheetsWithZoho } from "@/utils/googleSheetsToZoho";

export async function POST(req: any, res: any) {
	try {
		await syncGoogleSheetsWithZoho();
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
