import { NextResponse } from "next/server";
import axios from "axios";

export async function PATCH(request: Request, { params }: { params: { productId: string } }) {
	const { productId } = params;

	try {
		const body = await request.json(); // Data to update

		const response = await axios.patch(
			`https://www.zohoapis.com/inventory/v1/items/${productId}`,
			body,
			{
				headers: {
					Authorization: `Zoho-oauthtoken ${process.env.ZOHO_INVENTORY_ACCESS_TOKEN}`,
				},
				params: {
					organization_id: process.env.ZOHO_ORG_ID,
				},
			},
		);

		return NextResponse.json(response.data);
	} catch (error: any) {
		return NextResponse.json({ error: error.message }, { status: 500 });
	}
}
