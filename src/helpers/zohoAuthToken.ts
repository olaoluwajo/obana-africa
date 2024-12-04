import fetch from "node-fetch";

// Zoho Inventory credentials
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;

// Zoho Mail credentials
const ZOHO_MAIL_REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN;
const ZOHO_MAIL_CLIENT_ID = process.env.ZOHO_MAIL_CLIENT_ID;
const ZOHO_MAIL_CLIENT_SECRET = process.env.ZOHO_MAIL_CLIENT_SECRET;

// Interface to handle token response
interface ZohoTokenResponse {
	access_token: string;
	expires_in: number;
	error?: string;
}

let accessTokenExpiry = Date.now();
let mailAccessTokenExpiry = Date.now();

// Function to refresh the Zoho Inventory access token
export async function getAccessToken() {
	const accessToken = process.env.ZOHO_API_TOKEN;

	// If token is still valid, return it
	if (accessToken && Date.now() < accessTokenExpiry) {
		return accessToken;
	}

	console.log("Requesting new Zoho Inventory access token...");

	// Fetch a new access token if the old one is expired
	const response = await fetch("https://accounts.zoho.com/oauth/v2/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			refresh_token: ZOHO_REFRESH_TOKEN || "",
			client_id: ZOHO_CLIENT_ID || "",
			client_secret: ZOHO_CLIENT_SECRET || "",
			grant_type: "refresh_token",
		}),
	});

	const data = (await response.json()) as ZohoTokenResponse;

	if (!response.ok) {
		throw new Error(`Failed to refresh Zoho Inventory access token: ${data.error}`);
	}

	// Save the new token in environment variables
	process.env.ZOHO_API_TOKEN = data.access_token;

	accessTokenExpiry = Date.now() + data.expires_in * 1000;

	return data.access_token;
}

// Function to refresh the Zoho Mail access token
export async function getMailAccessToken() {
	const accessToken = process.env.MAIL_ACCESS_TOKEN;
	console.log("ACCESS TOKEN", accessToken);

	// If token is still valid, return it
	if (accessToken && Date.now() < mailAccessTokenExpiry) {
		return accessToken;
	}

	console.log("Requesting new Zoho Mail access token...");

	// Fetch a new access token if the old one is expired
	const response = await fetch("https://accounts.zoho.com/oauth/v2/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: new URLSearchParams({
			refresh_token: ZOHO_MAIL_REFRESH_TOKEN || "",
			client_id: ZOHO_MAIL_CLIENT_ID || "",
			client_secret: ZOHO_MAIL_CLIENT_SECRET || "",
			grant_type: "refresh_token",
		}),
	});

	const data = (await response.json()) as ZohoTokenResponse;

	if (!response.ok) {
		throw new Error(`Failed to refresh Zoho Mail access token: ${data.error}`);
	}

	// Save the new token in environment variables
	process.env.MAIL_ACCESS_TOKEN = data.access_token;

	mailAccessTokenExpiry = Date.now() + data.expires_in * 1000;

	console.log("ACCESS TOKEN", data.access_token);
	return data.access_token;
}
