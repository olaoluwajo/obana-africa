import { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

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
        setFilteredCountries(data);
      } catch (error) {
        console.error("Failed to fetch countries", error);
      }
    };
    loadCountries();
  }, []);

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

  const handleDropdownSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setFilteredCountries(
      countries.filter((country) =>
        country.name.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded">
        <input
          type="text"
          autoComplete="off"
          placeholder="Your country"
          value={search}
          onClick={() => {
            setShowDropdown(!showDropdown);
            setFilteredCountries(countries); // Show all countries when clicked
          }}
          className="w-full p-2 focus:border-[#539dab] outline-none"
          readOnly
        />
        <FaChevronUp
          className={`mr-2 text-gray-500 cursor-pointer transform ${
            showDropdown ? "rotate-180" : ""
          }`}
          onClick={() => setShowDropdown(!showDropdown)}
        />
      </div>

      {showDropdown && (
        <div className="absolute w-full border border-gray-300 rounded bg-white max-h-60 overflow-y-auto mt-1 z-[9]">
          <input
            type="text"
            placeholder="Search country"
            onChange={handleDropdownSearch}
            className="w-full p-2 border-b border-gray-200 outline-none"
          />
          <ul>
            {filteredCountries.map((country, index) => (
              <li
                key={index}
                onMouseDown={() => handleCountrySelect(country.name)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {country.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
