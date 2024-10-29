import { getAccessToken } from "@/app/lib/zohoAuth";
import { NextResponse } from "next/server";

interface ZohoVendorData {
  contact_name: string;
  contact_number?: string;
  legal_name?: string;
  company_name: string;
  // vendor_name: string;
  email: string;
  mobile?: string;
  contact_type: string;
  customer_name?: string;
  first_name?: string;
  companyName?: string;
  brandName?: string;
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
  notes?: string;
  website?: string;
  documents?: File | any[];
  termsDocuments?: File | any[];
  documentSubmitted?: string;
  // designation: string;
  // invited_by: string;
  tax_id?: string;
  billing_address?: Address | any;
  contact_persons: [] | undefined;
}

interface Address {
  address_id: string;
  attention: string;
  address: string;
  street2: string;
  city: string;
  state_code: string;
  state: string;
  zip: string;
  country: string;
  county: string;
  country_code: string;
  phone: string;
  fax: string;
}

export async function POST(req: Request) {
  console.log("API route hit");
  const formData = await req.json();
  // console.log("Form Data:", formData);
  // console.log(
  //   "Environment Variables:",
  //   process.env.ZOHO_API_TOKEN,
  //   process.env.ZOHO_ORG_ID,
  //   process.env.ZOHO_REFRESH_TOKEN,
  //   process.env.ZOHO_CLIENT_SECRET
  // );

  const [first_name = "", ...lastNameParts] =
    formData.contactPerson?.split(" ") || [];
  const last_name = lastNameParts.join(" ");

  const zohoVendorData: ZohoVendorData = {
    contact_name: formData.contactPerson || "",
    // first_name: formData.contactPerson || "",
    customer_name: formData.contactPerson || "",
    contact_number: formData.taxId || "",
    company_name: formData.companyName || "",
    website: formData.website || "",
    contact_type: "vendor",

    twitter: formData.twitter || "",
    facebook: formData.facebook || "",
    email: formData.email || "",
    phone: formData.phone || "",
    mobile: formData.phone,
    notes: formData.description,

    documents: [
      ...(formData.documents ? [{ document: formData.documents }] : []),
      ...(formData.termsDocuments
        ? [{ document: formData.termsDocuments }]
        : []),
    ],
    tax_id: formData.taxId,
    billing_address: {
      address: formData.address || "",
      country: formData.country || "",
      city: formData.city || "",
    },
    contact_persons: formData.contactPersons || [
      {
        salutation: "",
        first_name: first_name,
        last_name: last_name,
        email: formData.email || "",
        phone: formData.phone || "",
        mobile: formData.phone || "",
        department: formData.businessType || "",
        designation: formData.productCategories?.join(", ") || "",
        documents: [formData.documents, formData.termsDocuments],
      },
    ],
  };

  if (formData.contactType === "customer") {
    zohoVendorData.customer_name = formData.contactPerson || "N/A";
  }

  console.log("Data being sent to Zoho:", zohoVendorData);
  const accessToken = await getAccessToken();

  const options = {
    method: "POST",
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({ contacts: [zohoVendorData] }),
    body: JSON.stringify([zohoVendorData]),
  };
  // console.log("Final Payload:", options.body);

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
