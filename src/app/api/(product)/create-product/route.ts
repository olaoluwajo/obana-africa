import { NextResponse } from "next/server";
import { createProduct } from "@/helpers/createProductHelper";
export async function POST(request: Request) {
	try {
		// Parse the request body
		const body = await request.json();
		const { vendorId, productData } = body;
		console.log("VENDOR ID", vendorId);
		// console.log("PRODUCT DATA", productData);

		if (!vendorId) {
			console.error("Vendor ID missing in the request body");
			return NextResponse.json(
				{ error: "Vendor ID is required to fetch vendor details" },
				{ status: 400 },
			);
		}

		const productResponse = await createProduct(vendorId, productData);
		// console.log("PRODUCT RESPONSE", productResponse);

		// Return the product creation response
		return NextResponse.json(productResponse);
	} catch (error: any) {
		console.error("Error in create product handler:", error);

		return NextResponse.json(
			{ error: "Failed to create product", message: error.message },

			{ status: 500 },
		);
	}
}
