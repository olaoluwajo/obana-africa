import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      "https://gist.githubusercontent.com/devhammed/78cfbee0c36dfdaa4fce7e79c0d39208/raw/494967e8ae71c9fed70650b35dd96e9273fa3344/countries.json"
    );
    // const response = await axios.get("https://restcountries.com/v3.1/all");
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching countries:", error);
    return NextResponse.error();
  }
}