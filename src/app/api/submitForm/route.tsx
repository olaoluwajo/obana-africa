import { getAccessToken } from "@/lib/zohoAuth";
import { NextResponse } from "next/server";

interface ZohoVendorData {
	contact_name: string;
	contact_number?: string;
	legal_name?: string;
	company_name: string;
	email: string;
	mobile?: string;
	contact_type: string;
	customer_name?: string;
	first_name?: string;
	companyName?: string;
	brandName?: string;
	bankName?: string;
	accountNumber?: string;
	accountName?: string;
	businessType?: string;
	businessCategory?: string;
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
	productCategories?: string[] | undefined;
	description?: string;
	notes?: string;
	website?: string;
	documents?: [];
	termsDocuments?: File | null;
	documentSubmitted?: string;
	billing_address?: Address | any;
	contact_persons: [] | undefined;
	custom_fields?: CustomField[];
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
interface CustomField {
	value: string;
	index: number;
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

	const formattedAccount = `
  ${formData.bankName || "N/A"} 
    ${formData.accountNumber || "N/A"} 
   ${formData.accountName || "N/A"}
  `
		.replace(/\n/g, "")
		.trim();
	const trimmedFormattedAccount = formattedAccount.slice(0, 95);

	const customFields = [
		{
			value: formData.bankName,
			index: 1,
		},
		{
			value: formData.accountNumber,
			index: 2,
		},
		{
			value: formData.accountName,
			index: 3,
		},
	];

	const [first_name = "", ...lastNameParts] = formData.contactPerson?.split(" ") || [];

	const last_name = lastNameParts.join(" ");

	const websiteInput = formData.website || "";

	const formattedWebsite = websiteInput ? (websiteInput.startsWith("https://") ? websiteInput : `https://${websiteInput}`) : "";

	const facebookInput = formData.facebook || "";

	const formattedFacebookInput = facebookInput
		? facebookInput.startsWith("https://")
			? facebookInput
			: facebookInput.startsWith("www.")
			? `https://${facebookInput}`
			: `https://www.${facebookInput}`
		: "";

	const formattedFacebook = formattedFacebookInput ? formattedFacebookInput.replace(/\s+/g, "") : "";

	const formattedTwitter = formData.twitter ? formData.twitter.replace(/\s+/g, "") : "";

	const formattedNumber = formData.phone ? formData.phone.replace(/-\s/g, "") : "";

	const zohoVendorData: ZohoVendorData = {
		custom_fields: customFields,
		contact_name: formData.contactPerson || "",
		customer_name: formData.contactPerson || "",
		contact_number: formData.taxId || "",
		company_name: formData.companyName || "",
		website: formattedWebsite,
		contact_type: "vendor",
		twitter: formattedTwitter,
		facebook: formattedFacebook,
		email: formData.email || "",
		phone: formData.phone || "",
		mobile: formData.phone,
		notes: formattedAccount && formData.description,
		documents: formData.dataDocuments,

		billing_address: {
			address: formData.address || "",
			country: formData.country || "",
			city: formData.city || "",
			state: formData.state || "",
		},
		contact_persons: formData.contactPersons || [
			{
				salutation: "",
				first_name: first_name,
				last_name: last_name,
				email: formData.email || "",
				phone: formattedNumber,
				mobile: formattedNumber,
				department: formData.businessType || "",
				designation: formData.productCategories?.join(", ") || "",
				documents: formData.dataDocuments,
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
		body: JSON.stringify([zohoVendorData]),
	};
	// console.log("Final Payload:", options.body);

	try {
		const response = await fetch(`https://www.zohoapis.com/inventory/v1/contacts?organization_id=${encodeURIComponent(process.env.ZOHO_ORG_ID ?? "")}`, options);
		const data = await response.json();

		if (!response.ok) {
			console.error("Error from Zoho API:", data);
			throw new Error(`Error: ${data.code} - ${data.message}`);
		}

		return NextResponse.json(data, { status: 200 });
	} catch (error) {
		console.error("Error in API route:", error);
		return NextResponse.json({ error: "Failed to create contact." }, { status: 500 });
	}
}
