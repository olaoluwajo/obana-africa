import React, { useState, useEffect } from "react";
import { FaChevronUp } from "react-icons/fa";

interface StatesComponentProps {
  states: string[];
  setSelectedState: (state: string) => void;
}

const StatesComponent: React.FC<StatesComponentProps> = ({
  states,
  setSelectedState,
}) => {
  const [search, setSearch] = useState(states[0] );
  const [filteredStates, setFilteredStates] = useState<string[]>(states);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Set the default selected state as the first state if available
    if (states.length > 0 && !search) {
      setSearch(states[0]);
      setSelectedState(states[0]);
    }
  }, [states, setSelectedState, search]);

  const handleDropdownSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setFilteredStates(
      states.filter((state) =>
        state.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  const handleStateSelect = (stateName: string) => {
    setSearch(stateName);
    setSelectedState(stateName);
    setShowDropdown(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded">
        <input
          type="text"
          placeholder="Your state/province"
          value={search}
          readOnly
          onClick={() => {
            setShowDropdown(!showDropdown);
            setFilteredStates(states); 
          }}
          className="w-full p-2 focus:border-[#539dab] outline-none"
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
            placeholder="Search state"
            onChange={handleDropdownSearch}
            className="w-full p-2 border-b border-gray-200 outline-none"
          />
          <ul>
            {filteredStates.map((state, index) => (
              <li
                key={index}
                onMouseDown={() => handleStateSelect(state)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {state}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatesComponent;
