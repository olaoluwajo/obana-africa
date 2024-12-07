import { NextResponse } from "next/server";
import checkIfVendorExists from "@/helpers/isVendorExistHelper";

export async function GET(request: Request) {
	// Get the email from query parameters
	const { searchParams } = new URL(request.url);
	const email = searchParams.get("email");

	if (!email) {
		return NextResponse.json({ error: "Email is required" }, { status: 400 });
	}

	try {
		const vendorExists = await checkIfVendorExists(email);

		return NextResponse.json({ vendorExists });
	} catch (error) {
		return NextResponse.json({ error: "Error checking vendor" }, { status: 500 });
	}
}
