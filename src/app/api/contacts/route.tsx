import { NextResponse } from "next/server";
import { getAccessToken } from "@/app/lib/zohoAuth";


export async function GET() {
   const accessToken = await getAccessToken();
  const options = {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
    },
  };

  try {
    const res = await fetch(
      `https://www.zohoapis.com/inventory/v1/contacts?organization_id=${process.env.ZOHO_ORG_ID}`,
      options
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: "Network response was not ok" },
        { status: 500 }
      );
    }

    const data = await res.json();
    return NextResponse.json(data.contacts); 
  } catch (err) {
    console.error("Error fetching contacts:", err);
    return NextResponse.json(
      { error: "Failed to fetch contacts." },
      { status: 500 }
    );
  }
}
