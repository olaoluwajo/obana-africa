import fetch from "node-fetch";

const ZOHO_REFRESH_TOKEN = process.env.ZOHO_REFRESH_TOKEN;
const ZOHO_CLIENT_ID = process.env.ZOHO_CLIENT_ID;
const ZOHO_CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET;

interface ZohoTokenResponse {
  access_token: string;
  expires_in: number;
  error?: string;
}

let accessTokenExpiry = Date.now();


// Function to refresh the access token
export async function getAccessToken() {
  const accessToken = process.env.ZOHO_API_TOKEN;

  // Check if the access token is still valid
  // if (accessToken) {
  //   return accessToken;
  // }

  // If token is still valid, return it
  if (accessToken && Date.now() < accessTokenExpiry) {
    return accessToken;
  }

  console.log("Requesting new access token...");

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
  // const data = (await response.json()) as {
  //   access_token: string;
  //   expires_in: number;
  //   error?: string;
  // };
  const data = (await response.json()) as ZohoTokenResponse;

  if (!response.ok) {
    throw new Error(`Failed to refresh access token: ${data.error}`);
  }

  // Save the new token in environment variables
  process.env.ZOHO_API_TOKEN = data.access_token;

  accessTokenExpiry = Date.now() + data.expires_in * 1000;

  return data.access_token;
}
