import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(""); 
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching cities:", error);
    return NextResponse.error();
  }
}
