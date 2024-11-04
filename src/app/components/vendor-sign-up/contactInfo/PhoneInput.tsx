// components/PhoneInput.tsx
import React, { useState, useEffect } from "react";
// import { FaChevronUp } from "react-icons/fa";
import { LuChevronsUpDown } from "react-icons/lu";

interface PhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
}

interface Country {
  name: string;
  flag?: string;
  code?: string;
  dial_code: string;
}
const PhoneInput: React.FC<PhoneInputProps> = ({ value, onChange }) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [detectedCountry, setDetectedCountry] = useState<Country | null>(null);

  useEffect(() => {
    // Fetch the country data from your API
    const fetchCountries = async () => {
      try {
        const response = await fetch("/api/contactInfo/country-code");
        const data: Country[] = await response.json();
        // const data = response.data;
        setCountries(data);
        const defaultCountry = data.find(
          (country) => country.dial_code === "+234"
        );
        if (defaultCountry) {
          setDetectedCountry(defaultCountry);
          onChange(defaultCountry.dial_code + " ");
        }
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    // Initialize detected country based on the default or provided value
    if (value && countries.length) {
      const matchedCountry = countries.find((country) =>
        value.startsWith(country.dial_code)
      );
      setDetectedCountry(matchedCountry || null);
    }
  }, [value, countries]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPhone = e.target.value;
    if (inputPhone.length > 3) {
      onChange(inputPhone);
    }
    //  onChange(inputPhone);
    // onChange(inputPhone);
    //   const matchedCountry = countries.find((country) =>

    //   inputPhone.startsWith(country.dial_code.replace("+", ""))
    // );

    // if (matchedCountry) {
    //   setDetectedCountry(matchedCountry);
    // }
  };

  const handleCountrySelect = (country: Country) => {
    const newValue = country.dial_code + " ";
    onChange(newValue + value.replace(/^\+[^ ]* /, ""));
    // onChange(newValue);
    setDetectedCountry(country);
    setDropdownOpen(false);
  };

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded ">
        {detectedCountry ? (
          <span
            className="flex items-center mr-2 text-md cursor-pointer bg-gray-200 p-2 "
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            {detectedCountry.flag}
            <LuChevronsUpDown size={15} className="ml-1" />
          </span>
        ) : (
          <span
            className="flex items-center mr-2 text-md cursor-pointer bg-gray-200 p-2 "
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            🌐
          </span>
        )}
        <input
          type="tel"
          value={value}
          onChange={handlePhoneChange}
          placeholder="Enter phone number"
          className=" p-2 w-full focus:border-[#539dab] outline-none"
        />
      </div>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-1 w-3/4 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-auto">
          <input
            type="text"
            placeholder="Search for a country..."
            className="p-2 border-b border-gray-300 w-full outline-none focus:border-[#539dab] "
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {filteredCountries.length === 0 ? (
            <div className="p-2 text-gray-400">No countries found</div>
          ) : (
            filteredCountries.map((country) => (
              <div
                key={country.code}
                className="p-2 cursor-pointer hover:bg-gray-200"
                onClick={() => handleCountrySelect(country)}
              >
                {country.name} {country.dial_code}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default PhoneInput;
