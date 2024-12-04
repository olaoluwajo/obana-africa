import React, { useState } from "react";
import CountrySelector from "./CountryComponent";
import StatesComponent from "./StatesComponent";

interface VendorFormData {
  address?: string;
  city?: string;
  country?: string;
  state?: string;
}

interface Errors {
  address?: string;
  city?: string;
  country?: string;
}

interface AddressInfoProps {
  formData: VendorFormData;
  errors: Errors;
  handleChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  setFormData: React.Dispatch<React.SetStateAction<VendorFormData>>;
}

const AddressInfo: React.FC<AddressInfoProps> = ({
  formData,
  errors,
  handleChange,
  setFormData,
}) => {
  const [selectedCountry, updateSelectedCountry] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState("");

  const setSelectedCountry = (country: string) => {
    updateSelectedCountry(country);
    setFormData((prevData) => ({ ...prevData, country }));
  };
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-gray-700">
        Address Information
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Country *
          </label>
          {errors.country && (
            <p className="text-red-500 text-sm">{errors.country}</p>
          )}
          <CountrySelector
            setSelectedCountry={setSelectedCountry}
            setStates={setStates}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            States / Region
          </label>

          <StatesComponent
            states={states}
            setSelectedState={(state) => {
              setSelectedState(state);
              setFormData((prevData) => ({ ...prevData, state: state }));
            }}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          City *
        </label>
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        <input
          type="text"
          name="city"
          autoComplete="off"
          required
          className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
            errors.city ? "border-red-500" : ""
          }`}
          value={formData.city}
          onChange={handleChange}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Operational Address *
        </label>
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address}</p>
        )}
        <textarea
          name="address"
          required
          rows={3}
          className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
            errors.address ? "border-red-500" : ""
          }`}
          value={formData.address}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default AddressInfo;
