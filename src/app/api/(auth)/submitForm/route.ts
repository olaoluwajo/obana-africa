import { NextResponse } from "next/server";
import { sendZohoVendorData } from "@/helpers/signUpHelpers";

export async function POST(req: Request) {
	try {
		const formData = await req.json();
		const data = await sendZohoVendorData(formData);
		return NextResponse.json(data, { status: 200 });
	} catch (error: any) {
		console.error("Error in POST /api/submitForm:", error.message);
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
