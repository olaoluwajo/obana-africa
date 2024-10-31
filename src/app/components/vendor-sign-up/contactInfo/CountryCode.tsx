import { fetchCountryCodes } from "@/app/utils/countryCodeUtils";
import { useState, useEffect } from "react";

interface CountryCode {
  name?: any;
  code?: any;
}

interface CountryCodeSelectorProps {
  onCodeSelect: (code: string) => void;
}

function CountryCodeSelector({ onCodeSelect }: CountryCodeSelectorProps) {
  const [countryCodes, setCountryCodes] = useState<CountryCode[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState("+1");

  useEffect(() => {
    async function getCountryCodes() {
      try {
        const codes = await fetchCountryCodes();
         const sortedCodes = codes.sort(
           (a, b) => parseInt(a.code) - parseInt(b.code)
         );
        setCountryCodes(sortedCodes);
      } catch (error) {
        console.error("Error fetching country codes:", error);
      }
    }
    getCountryCodes();
  }, []);

   const handleCodeSelect = (code: string) => {
    setSelectedCode(code);
    onCodeSelect(code);
    setDropdownOpen(false);
  };

  return (
    <div className="absolute">
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="px-3 py-2 bg-transparent rounded-l-md text-gray-700"
      >
        {selectedCode}
      </button>

      {dropdownOpen && (
        <ul className="absolute z-10 bg-white border rounded-md max-h-40 overflow-y-auto w-20 left-0 top-12 ">
          {countryCodes.map((country, index) => (
            <li
              key={index}
              onClick={() => handleCodeSelect(country.code)}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {country.code}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CountryCodeSelector;
