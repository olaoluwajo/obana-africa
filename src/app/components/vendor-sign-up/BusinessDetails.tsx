import { XCircle } from "lucide-react";
import React from "react";

interface VendorFormData {
  registrationNumber?: string;
  taxId?: string;
  productCategories?: string[];
  description?: string;
  documents?: File ; 
  termsDocuments?: File ;
}

interface Errors {
  registrationNumber?: string;
  taxId?: string;
  productCategories?: string;
  description?: string;
  documents?: string;
  termsDocuments?: string;
}

interface BusinessDetailsProps {
  formData: VendorFormData;
  errors: Errors;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleCategoryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  removeCategory: (category: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<VendorFormData>>;
  handleDownload: () => void;
  isDocumentDownloaded: boolean;
}



const productCategoryOptions = [
  "--select category--",
  "Fashion",
  "Beauty",
  "Lifestyle",
  "Groceries",
];

const BusinessDetails: React.FC<BusinessDetailsProps> = ({
  formData,
  errors,
  isDocumentDownloaded,
  handleChange,
  handleCategoryChange,
  removeCategory,
  handleDownload,
  setFormData,
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-gray-700">Business Details</h2>
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Registration Number *
      </label>
      {errors.registrationNumber && (
        <p className="text-red-500  text-sm">{errors.registrationNumber}</p>
      )}
      <input
        type="text"
        name="registrationNumber"
        required
        className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
          errors.registrationNumber ? "border-red-500" : ""
        }`}
        value={formData.registrationNumber}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">Tax ID</label>
      <input
        type="text"
        name="taxId"
        className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
        value={formData.taxId}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Product Categories *
      </label>
      {errors.productCategories && (
        <p className="text-red-500  text-sm">{errors.productCategories}</p>
      )}
      <select
        name="productCategories"
        required
        className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
          errors.productCategories ? "border-red-500" : ""
        }`}
        value=""
        onChange={handleCategoryChange}
      >
        {productCategoryOptions.map((category) => (
          <option
            key={category}
            value={category}
            className="py-[4px] hover:bg-[#539dab] hover:text-white cursor-pointer"
          >
            {category}
          </option>
        ))}
      </select>
      {/* Display selected categories */}
      <div className="mt-2  ">
        {(formData.productCategories || []).length > 0 && (
          <div className="flex gap-2 items-center flex-wrap ">
            {(formData.productCategories || []).map((category) => (
              <div
                key={category}
                className="flex items-center justify-between bg-gray-100 p-2 rounded-md gap-2"
              >
                <span>{category}</span>
                <button
                  type="button"
                  aria-label="Remove category"
                  onClick={() => removeCategory(category)}
                  className="text-red-500 hover:text-red-700"
                >
                  <XCircle size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Description
      </label>
      <textarea
        name="description"
        rows={4}
        className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
        value={formData.description}
        onChange={handleChange}
      />
    </div>

    <div>
      <label className="block text-sm font-medium text-gray-700">
        Business Documents *
      </label>
      {errors.documents && (
        <p className="text-red-500  text-sm">{errors.documents}</p>
      )}
      <input
        type="file"
        name="documents"
        required
        value={formData.documents}
        className={`mt-1 block w-full rounded-md border px-3 py-2 ${
          errors.documents ? "border-red-500" : ""
        }`}
        onChange={(e) => {
          const file = e.target.files ? e.target.files[0] : null;

          setFormData((prev) => ({
            ...prev,
            documents: file,
          }));
        }}
      />
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-700">Policy</label>
      <div className=" md:flex space-x-4 mt-1 items-end justify-between">
        {/* Download Terms and Conditions */}
        <div className="md:w-1/2 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Accept our Terms and Conditions to continue signing up
          </label>
          <a
            onClick={handleDownload}
            className="mt-1 block md:w-[200px] rounded-md border px-3 py-2 text-center bg-[#43828d] text-white cursor-pointer"
          >
            Download document
          </a>
        </div>

        {/* Upload Business Documents */}
        <div className="md:w-1/2  mt-2 w-full">
          <label className="block text-sm font-medium text-gray-700">
            Submit document *
          </label>
          {errors.termsDocuments && (
            <p className="text-red-500  text-sm">{errors.termsDocuments}</p>
          )}
          <input
            type="file"
            name="termsDocuments"
            required
            value={formData.termsDocuments}
            className="mt-1 block w-full rounded-md border px-3 py-2"
            onChange={(e) => {
              const file = e.target.files ? e.target.files[0] : null;

              setFormData((prev) => ({
                ...prev,
                documents: file,
              }));
            }}
            disabled={!isDocumentDownloaded}
          />
        </div>
      </div>
    </div>
  </div>
);

export default BusinessDetails;
