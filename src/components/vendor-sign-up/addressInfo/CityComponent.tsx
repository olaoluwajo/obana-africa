import { useState, useEffect } from "react";
import axios from "axios";

interface CitySelectorProps {
  setSelectedCity: (city: string) => void;
}

interface City {
  name: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({ setSelectedCity }) => {
  const [cities, setCities] = useState<City[]>([]);
  const [search, setSearch] = useState("");
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadCities = async () => {
      try {
        const response = await axios.get("/api/addressInfo/citiesApi");
        setCities(response.data);
      } catch (error) {
        console.error("Failed to fetch cities", error);
      }
    };
    loadCities();
  }, []);

  useEffect(() => {
    if (search) {
      setFilteredCities(
        cities.filter((city) =>
          city.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    } else {
      setFilteredCities(cities);
    }
  }, [search, cities]);

  const handleCitySelect = (cityName: string) => {
    setSearch(cityName);
    setSelectedCity(cityName);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <input
        type="text"
        autoComplete="off"
        placeholder="Search for a city"
        value={search}
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={() => setShowDropdown(false)}
        className="w-full border border-gray-300 rounded p-2 focus:border-[#539dab] outline-none"
      />
      {showDropdown && filteredCities.length > 0 && (
        <ul className="absolute w-full border border-gray-300 rounded bg-white max-h-60 overflow-y-auto mt-1">
          {filteredCities.map((city, index) => (
            <li
              key={index}
              onMouseDown={() => handleCitySelect(city.name)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {city.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CitySelector;
