import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get("https://restcountries.com/v3.1/all");
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.error();
  }
}