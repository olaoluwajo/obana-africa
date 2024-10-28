import fetch from "node-fetch";

const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;

interface ZohoTokenResponse {
  access_token: string;
  expires_in: number;
  error?: string;
}

// Function to refresh the access token
export async function getAccessToken() {
  const accessToken = process.env.ZOHO_API_TOKEN;

  // Check if the access token is still valid
  if (accessToken) {
    return accessToken;
  }

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

  // const data = await response.json();
  // const data: ZohoTokenResponse = await response.json();
  const data = (await response.json()) as {
    access_token: string;
    expires_in: number;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(`Failed to refresh access token: ${data.error}`);
  }

  // Save the new token in environment variables (or use a secure storage for production)
  process.env.ZOHO_API_TOKEN = data.access_token;

  return data.access_token;
}
