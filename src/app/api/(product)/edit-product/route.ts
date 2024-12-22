import { NextResponse } from "next/server";
import { editProduct } from "@/helpers/editProductHelpers";

export async function PUT(request: Request) {
	try {
		const body = await request.json();
		const { productId, productData } = body;

		if (!productId) {
			console.error("Product ID missing in the request body");
			return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
		}

		const productResponse = await editProduct(productId, productData);
		return NextResponse.json(productResponse);
	} catch (error: any) {
		console.error("Error in edit product handler:", error);
		return NextResponse.json(
			{ error: "Failed to edit product", message: error.message },
			{ status: 500 },
		);
	}
}
