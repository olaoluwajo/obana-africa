import axios from "axios";

interface Country {
  name: {
    common: string;
  };
  idd: {
    root: string;
    suffixes?: string[];
  };
}

interface CountryCode {
  name: string;
  code: string;
}


export async function fetchCountryCodes(): Promise<CountryCode[]> {
  const response = await axios.get<Country[]>(
    "https://restcountries.com/v3.1/all"
  );
  const countryCodes = response.data.map((country) => ({
    name: country.name.common,
    code:
      country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : ""),
  }));
  return countryCodes;
}
