import axios from "axios";

// Zoho Inventory credentials
const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;

// Zoho Mail credentials
const ZOHO_MAIL_REFRESH_TOKEN = process.env.MAIL_REFRESH_TOKEN;
const ZOHO_MAIL_CLIENT_ID = process.env.ZOHO_MAIL_CLIENT_ID;
const ZOHO_MAIL_CLIENT_SECRET = process.env.ZOHO_MAIL_CLIENT_SECRET;

// Zoho Inventory credentials
const ZOHO_INVENTORY_REFRESH_TOKEN = process.env.ZOHO_INVENTORY_REFRESH_TOKEN;
const ZOHO_INVENTORY_CLIENT_ID = process.env.ZOHO_MAIL_CLIENT_ID;
const ZOHO_INVENTORY_CLIENT_SECRET = process.env.ZOHO_MAIL_CLIENT_SECRET;

// Zoho Inventory credentials
const ZOHO_INVENTORY_SALES_REFRESH_TOKEN = process.env.ZOHO_INVENTORY_SALES_REFRESH_TOKEN;

// Interface to handle token response
interface ZohoTokenResponse {
	access_token: string;
	expires_in: number;
	error?: string;
}

let accessTokenExpiry = Date.now();
let mailAccessTokenExpiry = Date.now();
let inventoryAccessTokenExpiry = Date.now();

// Function to refresh the Zoho Contacts access token
export async function getAccessToken() {
	const accessToken = process.env.ZOHO_API_TOKEN;

	// If token is still valid, return it
	if (accessToken && Date.now() < accessTokenExpiry) {
		return accessToken;
	}

	console.log("Requesting new Zoho Inventory access token...");

	// Fetch a new access token if the old one is expired
	try {
		const response = await axios.post(
			"https://accounts.zoho.com/oauth/v2/token",
			new URLSearchParams({
				refresh_token: ZOHO_REFRESH_TOKEN || "",
				client_id: ZOHO_CLIENT_ID || "",
				client_secret: ZOHO_CLIENT_SECRET || "",
				grant_type: "refresh_token",
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		const data = response.data as ZohoTokenResponse;

		// Handle error response from Zoho
		if (response.status !== 200) {
			throw new Error(`Failed to refresh Zoho Inventory access token: ${data.error}`);
		}

		// Save the new token in environment variables
		process.env.ZOHO_API_TOKEN = data.access_token;
		console.log("REFRESHED TOKEN", data.access_token);

		accessTokenExpiry = Date.now() + data.expires_in * 1000;

		return data.access_token;
	} catch (error: any) {
		throw new Error(`Error refreshing Zoho Inventory access token: ${error.message}`);
	}
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
	try {
		const response = await axios.post(
			"https://accounts.zoho.com/oauth/v2/token",
			new URLSearchParams({
				refresh_token: ZOHO_MAIL_REFRESH_TOKEN || "",
				client_id: ZOHO_MAIL_CLIENT_ID || "",
				client_secret: ZOHO_MAIL_CLIENT_SECRET || "",
				grant_type: "refresh_token",
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		const data = response.data as ZohoTokenResponse;

		// Handle error response from Zoho
		if (response.status !== 200) {
			throw new Error(`Failed to refresh Zoho Mail access token: ${data.error}`);
		}

		// Save the new token in environment variables
		process.env.MAIL_ACCESS_TOKEN = data.access_token;

		mailAccessTokenExpiry = Date.now() + data.expires_in * 1000;

		console.log("ACCESS TOKEN", data.access_token);
		return data.access_token;
	} catch (error: any) {
		throw new Error(`Error refreshing Zoho Mail access token: ${error.message}`);
	}
}

// Function to refresh the Zoho Inventory access token
export async function getInventoryAccessToken() {
	const accessToken = process.env.ZOHO_INVENTORY_ACCESS_TOKEN;
	console.log("ACCESS TOKEN", accessToken);

	// If token is still valid, return it
	if (accessToken && Date.now() < inventoryAccessTokenExpiry) {
		return accessToken;
	}

	console.log("Requesting new Zoho Inventory access token...");

	// Fetch a new access token if the old one is expired
	try {
		const response = await axios.post(
			"https://accounts.zoho.com/oauth/v2/token",
			new URLSearchParams({
				refresh_token: ZOHO_INVENTORY_REFRESH_TOKEN || "",
				client_id: ZOHO_INVENTORY_CLIENT_ID || "",
				client_secret: ZOHO_INVENTORY_CLIENT_SECRET || "",
				grant_type: "refresh_token",
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		const data = response.data as ZohoTokenResponse;

		// Handle error response from Zoho
		if (response.status !== 200) {
			throw new Error(`Failed to refresh Zoho Inventory access token: ${data.error}`);
		}

		// Save the new token in environment variables
		process.env.ZOHO_INVENTORY_ACCESS_TOKEN = data.access_token;

		inventoryAccessTokenExpiry = Date.now() + data.expires_in * 1000;

		console.log("INVENTORY ACCESS TOKEN", data.access_token);
		return data.access_token;
	} catch (error: any) {
		throw new Error(`Error refreshing Zoho Inventory access token: ${error.message}`);
	}
}
// Function to refresh the Zoho Inventory access token
export async function getSalesAccessToken() {
	const accessToken = process.env.ZOHO_INVENTORY_SALES_TOKEN;
	console.log("ACCESS TOKEN", accessToken);

	// If token is still valid, return it
	if (accessToken && Date.now() < inventoryAccessTokenExpiry) {
		return accessToken;
	}

	console.log("Requesting new Zoho Inventory access token...");

	// Fetch a new access token if the old one is expired
	try {
		const response = await axios.post(
			"https://accounts.zoho.com/oauth/v2/token",
			new URLSearchParams({
				refresh_token: ZOHO_INVENTORY_SALES_REFRESH_TOKEN || "",
				client_id: ZOHO_CLIENT_ID || "",
				client_secret: ZOHO_CLIENT_SECRET || "",
				grant_type: "refresh_token",
			}),
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
			},
		);

		const data = response.data as ZohoTokenResponse;

		// Handle error response from Zoho
		if (response.status !== 200) {
			throw new Error(`Failed to refresh Zoho Inventory access token: ${data.error}`);
		}

		// Save the new token in environment variables
		process.env.ZOHO_INVENTORY_SALES_TOKEN = data.access_token;

		inventoryAccessTokenExpiry = Date.now() + data.expires_in * 1000;

		console.log("SALES ACCESS TOKEN", data.access_token);
		return data.access_token;
	} catch (error: any) {
		throw new Error(`Error refreshing Zoho Inventory access token: ${error.message}`);
	}
}
