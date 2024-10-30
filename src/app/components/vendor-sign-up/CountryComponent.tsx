import { useState, useEffect } from "react";

interface CountrySelectorProps {
  setSelectedCountry: (country: string) => void;
}

interface Country {
  name: {
    common: string;
  };
}

const CountrySelector: React.FC<CountrySelectorProps> = ({
  setSelectedCountry,
}) => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [search, setSearch] = useState("");
  const [filteredCountries, setFilteredCountries] = useState<Country[]>([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries:", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (search) {
      const results = countries.filter((country) =>
        country.name.common.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCountries(results);
    } else {
      setFilteredCountries([]);
    }
  }, [search, countries]);

    const handleCountrySelect = (countryName: string) => {
      setSearch(countryName);
      setSelectedCountry(countryName);
      setFilteredCountries([]); 
    };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search for a country"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full border border-gray-300 rounded p-2"
      />
      {filteredCountries.length > 1 && (
        <ul className="absolute w-full border border-gray-300 rounded bg-white max-h-60 overflow-y-auto mt-1">
          {filteredCountries.map((country, index) => (
            <li
              key={index}
              onClick={() => handleCountrySelect(country.name.common)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {country.name.common}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CountrySelector;
