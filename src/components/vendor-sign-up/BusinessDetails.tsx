import { XCircle } from "lucide-react";
import React, { useState } from "react";
import TermsAndConditionModal from "../modals/TermsAndConditionModal";

interface VendorFormData {
  registrationNumber?: string;
  taxId?: string;
  productCategories?: string[];
  description?: string;
  documents?: File;
  termsDocuments?: File;
  businessType?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
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
    handleTermsAccept: () => void;
  termsAccepted: boolean;
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
  handleTermsAccept,
  termsAccepted,
}) => {
  // New state for checkbox and New state for modal visibility
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  // const [termsAccepted, setTermsAccepted] = useState(false);
  const handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | { name: string; value: string }
  ) => {
    const { name, value } = "target" in event ? event.target : event;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTermsCheckbox = () => {
    if (!termsAccepted) {
      setShowTermsModal(true);
    }
  };

  const acceptTerms = () => {
    setAgreeToTerms(true);
handleTermsAccept()
    setShowTermsModal(false);
  };

  const closeTermsModal = () => {
    setShowTermsModal(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-700">Business Details</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bank name
          </label>

          <input
            type="text"
            name="bankName"
            required
            placeholder="Enter your bank name"
            className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] 
          }`}
            value={formData.bankName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account number
          </label>

          <input
            type="number"
            name="accountNumber"
            required
            placeholder="Enter your account number"
            className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] 
          }`}
            min="0"
            value={formData.accountNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account name
          </label>
          <input
            type="text"
            name="accountName"
            placeholder="Name on account"
            className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab
          }`}
            value={formData.accountName}
            onChange={handleChange}
          />
        </div>
      </div>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Business Type
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
          {["PLC", "SME", "LP", "LLC"].map((type) => (
            <label
              key={type}
              className={`flex items-center py-2 px-4 rounded-lg w-full cursor-pointer border ${
                formData.businessType === type
                  ? "bg-[#43828d] pl-4 text-white font-semibold border-blue-400"
                  : "bg-white border-gray-300"
              }`}
              onClick={() =>
                setFormData((prev) => ({ ...prev, businessType: type }))
              }
            >
              <input
                type="radio"
                name="businessType"
                value={type}
                checked={formData.businessType === type}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    businessType: e.target.value,
                  }))
                }
                className={`mr-2 rounded-full ${
                  formData.businessType === type ? "hidden  " : "bg-gray-200"
                }`}
              />
              {type}
            </label>
          ))}
        </div>
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

      {/* <div>
        <label className="block text-sm font-medium text-gray-700">
          Business Documents *
        </label>
        {errors.documents && (
          <p className="text-red-500  text-sm">{errors.documents}</p>
        )}
        <input
          type="file"
          name="documents"
          accept=".pdf,.docx"
          onChange={(e) => {
            const file = e.target.files ? e.target.files[0] : undefined;

            setFormData((prev) => ({
              ...prev,
              documents: file,
            }));
          }}
        />
      </div> */}

      {/* <div>
        <label className="block text-sm font-bold text-gray-700">Policy</label>
        <div className=" md:flex space-x-4 mt-1 items-end justify-between">
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
              accept=".pdf,.docx"
              className="mt-1 block w-full rounded-md border px-3 py-2"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : undefined;

                setFormData((prev) => ({
                  ...prev,
                  termsDocuments: file,
                }));
              }}
              disabled={!isDocumentDownloaded}
            />
          </div>
        </div>
      </div> */}


       <div className="flex items-center mt-4">
        <label
          htmlFor="agreeTerms"
          className="ml-2  flex items-center justify-center font-semibold"
        >
          <input
            type="checkbox"
            className=" mr-2 size-[15px]"
          />
          Subscribe to our newsletter
        </label>
      </div>

      <div className="flex items-center">
        <label
          htmlFor="agreeTerms"
          className="ml-2  cursor-pointer flex items-center justify-center font-semibold"
          onClick={handleTermsCheckbox}
        >
          <input
            type="checkbox"
            id="agreeTerms"
            required
            checked={agreeToTerms}
            // onChange={(e) => setAgreeToTerms(e.target.checked)}
            onChange={(e) => {
              if (e.target.checked) {
                handleTermsAccept();
                setAgreeToTerms(true);
              } else {
                setAgreeToTerms(false);
              }
            }}
            className="cursor-pointer mr-2 size-[15px]"
            disabled={termsAccepted}
          />
          I agree to the Terms and Conditions
        </label>
      </div>
     
      {showTermsModal && (
        <TermsAndConditionModal
          onClose={closeTermsModal}
          onAccept={acceptTerms}
        />
      )}
    </div>
  );
};

export default BusinessDetails;
