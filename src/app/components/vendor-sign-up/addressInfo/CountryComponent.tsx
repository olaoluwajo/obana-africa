import { useState, useEffect } from "react";

interface CountrySelectorProps {
  setSelectedCountry: (country: string) => void;
  setStates: (states: string[]) => void;
}

interface Country {
  name: string;
  stateProvinces?: { name: string }[];
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  setSelectedCountry,
  setStates,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch("/api/addressInfo/countriesApi");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (search) {
      const results = countries.filter((country) =>
        country.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCountries(results);
    } else {
      setFilteredCountries(countries);
    }
  }, [search, countries]);

  // const handleCountrySelect = (countryName: string) => {
  //   setSearch(countryName);
  //   setSelectedCountry(countryName);
  //   // setFilteredCountries([]);
  //   setShowDropdown(false);
  // };
    const handleCountrySelect = (countryName: string) => {
      const selectedCountry = countries.find(
        (country) => country.name === countryName
      );
      if (selectedCountry) {
        setSelectedCountry(countryName);
        setStates(
          selectedCountry.stateProvinces?.map((state) => state.name) || []
        );
      }
      setSearch(countryName);
      setShowDropdown(false);
    };

  return (
    <div className="relative">
      <input
        type="text"
        autoComplete="off"
        placeholder="Your country"
        value={search}
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={() => setShowDropdown(false)}
        className="w-full border border-gray-300 rounded p-2 focus:border-[#539dab] outline-none"
      />
      {showDropdown && filteredCountries.length > 1 && (
        <ul className="absolute w-full border border-gray-300 rounded bg-white max-h-60 overflow-y-auto mt-1">
          {filteredCountries.map((country, index) => (
            <li
              key={index}
              // onClick={() => handleCountrySelect(country.name.common)}
              onMouseDown={() => handleCountrySelect(country.name)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {country.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySelector;
