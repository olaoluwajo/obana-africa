import { NextResponse } from "next/server";
import getVendorDetails from "@/helpers/isVendorExistHelper";

export async function GET(request: Request) {
	// Get the email from query parameters
	const { searchParams } = new URL(request.url);
	const email = searchParams.get("email");

	if (!email) {
		return NextResponse.json({ error: "Email is required" }, { status: 400 });
	}

	try {
		const { exists, vendorId, vendorName, contactName, firstName, lastName, vendorEmail } =
			await getVendorDetails(email);

		return NextResponse.json({
			exists,
			vendorId,
			vendorName,
			contactName,
			firstName,
			lastName,
			vendorEmail,
		});
	} catch (error) {
		console.log("ERROR", error);
		return NextResponse.json({ error: "Error checking vendor" }, { status: 500 });
	}
}
