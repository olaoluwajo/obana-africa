import { NextResponse } from "next/server";
import { getAccessToken } from "@/helpers/zohoAuthToken";
import { attemptDeleteProduct } from "@/helpers/deleteProductHelper";

export async function DELETE(request: Request) {
	try {
		const { productId } = await request.json();

		if (!productId) {
			return NextResponse.json(
				{ error: "Vendor ID and Product ID are required." },
				{ status: 400 },
			);
		}

		// Get the initial access token
		let accessToken = process.env.ZOHO_API_TOKEN;

		if (!accessToken) {
			accessToken = await getAccessToken();
			process.env.ZOHO_API_TOKEN = accessToken;
		}

		// Attempt to delete the product
		await attemptDeleteProduct(accessToken, productId);

		return NextResponse.json({ message: "Product deleted successfully." });
	} catch (error: any) {
		console.error("Error deleting product:", error);
		return NextResponse.json(
			{ error: "Failed to delete product", message: error.message },
			{ status: 500 },
		);
	}
}
