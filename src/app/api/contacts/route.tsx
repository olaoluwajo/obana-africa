import { NextResponse } from "next/server";

export async function GET() {
  const options = {
    method: "GET",
    headers: {
      Authorization: `Zoho-oauthtoken ${process.env.ZOHO_API_TOKEN}`,
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
