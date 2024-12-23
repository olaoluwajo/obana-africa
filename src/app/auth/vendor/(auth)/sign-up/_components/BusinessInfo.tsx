import React from "react";

interface VendorFormData {
  companyName?: string;
  brandName?: string;
  businessCategory?: string;
}

interface Errors {
  companyName?: string;
  businessCategory?: string;
  brandName?: string;
}

interface BusinessInfoProps {
  formData: VendorFormData;
  errors: Errors;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({
  formData,
  errors,
  handleChange,
}) => (
  <div className="space-y-4">
    <h1 className="text-xl font-semibold text-gray-700">
      Business Information
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Name *
        </label>
        {errors.companyName && (
          <p className="text-red-500 text-xs">{errors.companyName}</p>
        )}
        <input
          type="text"
          name="companyName"
          required
          placeholder="Enter your business name"
          className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
            errors.companyName ? "border-red-500" : ""
          }`}
          value={formData.companyName}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Brand Name
        </label>
        <input
          type="text"
          placeholder="Brand name"
          name="brandName"
          className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
            errors.brandName ? "border-red-500" : ""
          }`}
          value={formData.brandName}
          onChange={handleChange}
        />
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Business Category *
      </label>
      {errors.businessCategory && (
        <p className="text-red-500 text-sm">{errors.businessCategory}</p>
      )}
      <select
        name="businessCategory"
        required
        className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
          errors.businessCategory ? "border-red-500" : ""
        }`}
        value={formData.businessCategory}
        onChange={handleChange}
      >
        <option value="" className="!text-white">
          --Select Business Category--
        </option>
        <option value="manufacturer">Manufacturer</option>
        <option value="supplier">Supplier</option>
        <option value="distributor">Distributor</option>
        <option value="wholesaler">Wholesaler</option>
      </select>
    </div>
  </div>
);

export default BusinessInfo;
