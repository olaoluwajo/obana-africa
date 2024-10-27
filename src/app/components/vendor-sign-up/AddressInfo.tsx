import React from "react";

interface VendorFormData {
  address?: string;
  city?: string;
  country?: string;
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
}

const AddressInfo: React.FC<AddressInfoProps> = ({
  formData,
  errors,
  handleChange,
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-gray-700">Address Information</h2>
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

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          City *
        </label>
        {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
        <input
          type="text"
          name="city"
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
          Country *
        </label>
        {errors.country && (
          <p className="text-red-500  text-sm">{errors.country}</p>
        )}
        <input
          type="text"
          name="country"
          required
          className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
            errors.country ? "border-red-500" : ""
          }`}
          value={formData.country}
          onChange={handleChange}
        />
      </div>
    </div>
  </div>
);

export default AddressInfo;
