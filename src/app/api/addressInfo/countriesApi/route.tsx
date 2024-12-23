import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      "https://gist.githubusercontent.com/manishtiwari25/0fa055ee14f29ee6a7654d50af20f095/raw/89c6e4b02742f340064506215e6b3c3efe344a59/country_state.json"
    );
    // const response = await axios.get("https://restcountries.com/v3.1/all");
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.error();
  }
}