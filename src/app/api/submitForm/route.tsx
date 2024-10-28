import { NextResponse } from "next/server";

interface ZohoVendorData {
  contact_name: string;
  contact_number?: string;
  company_name: string;
  // vendor_name: string;
  email: string;
  mobile?: string;
  contact_type: string;
  customer_name?: string;
  companyName?: string;
  brandName?: string;
  billing_address?: string;
  businessType?: string;
  contactPerson?: string;
  phone?: string;
  address?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
  city?: string;
  country?: string;
  registrationNumber?: string;
  taxId?: string;
  productCategories?: string[] | undefined;
  description?: string;
  website?: string;
  documents?: any;
  termsDocuments?: any;
  documentSubmitted?: string;
  // custom_fields:[] | undefined
}

export async function POST(req: Request) {
  console.log("API route hit");
  const formData = await req.json();
  console.log("Form Data:", formData);
  console.log(
    "Environment Variables:",
    process.env.ZOHO_API_TOKEN,
    process.env.ZOHO_ORG_ID
  );

  const zohoVendorData: ZohoVendorData = {
    contact_name: formData.contactPerson || "",
    customer_name: formData.contactPerson || "",
    //   vendor_name: formData.businessType || "",
    contact_number: formData.taxId || "",
    company_name: formData.companyName || "",
    website: formData.website || "",
    contact_type: "vendor",
    // twitter: formData.twitter || "",
    facebook: formData.facebook || "",
    email: formData.email || "",
    phone: formData.phone || "",
    mobile: formData.mobile,
  };

  if (formData.contactType === "customer") {
    zohoVendorData.customer_name = formData.contactPerson || "N/A";
  }

  console.log("Data being sent to Zoho:", zohoVendorData);

  const options = {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${process.env.ZOHO_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({ contacts: [zohoVendorData] }),
    body: JSON.stringify([zohoVendorData]),
  };
  console.log("Final Payload:", options.body);

  try {
    const response = await fetch(
      `https://www.zohoapis.com/inventory/v1/contacts?organization_id=${encodeURIComponent(
        process.env.ZOHO_ORG_ID ?? ""
      )}`,
      options
    );
    const data = await response.json();

    if (!response.ok) {
      console.error("Error from Zoho API:", data);
      throw new Error(`Error: ${data.code} - ${data.message}`);
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "Failed to create contact." },
      { status: 500 }
    );
  }
}
