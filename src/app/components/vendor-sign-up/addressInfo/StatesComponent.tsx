import React, { useState, useEffect } from "react";

interface StatesComponentProps {
  states: string[];
  setSelectedState: (state: string) => void;
}

const StatesComponent: React.FC<StatesComponentProps> = ({
  states,
  setSelectedState,
}) => {
  const [search, setSearch] = useState("");
  const [filteredStates, setFilteredStates] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (search) {
      const results = states.filter((state) =>
        state.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredStates(results);
    } else {
      setFilteredStates(states);
    }
  }, [search, states]);

  const handleStateSelect = (stateName: string) => {
    setSearch(stateName);
    setSelectedState(stateName);
    setShowDropdown(false);
  };
  return (
    <div className="relative">
      <input
        type="text"
        autoComplete="off"
        placeholder="Your state/province"
        value={search}
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => setSearch(e.target.value)}
        onBlur={() => setShowDropdown(false)}
        className="w-full border border-gray-300 rounded p-2 focus:border-[#539dab] outline-none"
      />
      {showDropdown && filteredStates.length > 0 && (
        <ul className="absolute w-full border border-gray-300 rounded bg-white max-h-60 overflow-y-auto mt-1">
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
      )}
    </div>
  );
};

export default StatesComponent;
