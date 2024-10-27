"use client";
import React, { useState } from "react";

import { CheckCircle2, XCircle } from "lucide-react";
import { TiTick } from "react-icons/ti";
import BusinessInfo from "./BusinessInfo";
import ContactInfo from "./ContactInfo";
import AddressInfo from "./AddressInfo";
import BusinessDetails from "./BusinessDetails";

const VendorSignUp = () => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [notSubmitted, setNotSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isDocumentDownloaded, setIsDocumentDownloaded] = useState(false);
  const [errors, setErrors] = useState<ErrorsType>({});
  // const [formErrors, setFormErrors] = useState({});

  const [formData, setFormData] = useState<FormData>({
    companyName: "",
    brandName: "",
    businessType: "",
    contactPerson: "",
    email: "",
    phone: "",
    address: "",
    instagram: "",
    twitter: "",
    facebook: "",
    linkedin: "",
    city: "",
    country: "",
    registrationNumber: "",
    taxId: "",
    productCategories: [],
    description: "",
    website: "",
    documents: null,
    termsDocuments: null,
  });

  interface FormData {
    companyName?: string;
    brandName?: string;
    businessType?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    city?: string;
    country?: string;
    registrationNumber?: string;
    taxId?: string;
    productCategories?: string[] | undefined;
    description?: string;
    website?: string;
    documents?: any;
    termsDocuments?: any;
    documentSubmitted?: string;
  }
  interface ErrorsType {
    companyName?: string;
    brandName?: string;
    businessType?: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    address?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    city?: string;
    country?: string;
    registrationNumber?: string;
    taxId?: string;
    productCategories?: string;
    description?: string;
    website?: string;
    documents?: any;
    termsDocuments?: any;
    documentSubmitted?: string;
  }
  const productCategoryOptions = [
    "--select category--",
    "Fashion",
    "Beauty",
    "Lifestyle",
    "Groceries",
  ];

  interface FormErrors extends Partial<Record<keyof FormData, string>> {
    documentSubmitted?: string;
  }

  const validateStep = (currentStep: number) => {
    // const newErrors = {};
    // const newErrors: Partial<Record<keyof FormData, string>> = {};
    // const newErrors: Partial<Record<keyof ErrorsType, string | string[]>> = {};
    const newErrors: Partial<ErrorsType> = {};

    switch (currentStep) {
      case 1:
        if (!formData.companyName)
          newErrors.companyName = "Company Name is required.";
        if (!formData.businessType)
          newErrors.businessType = "Business Type is required.";
        break;

      case 2:
        if (!formData.contactPerson)
          newErrors.contactPerson = "Contact Person is required.";
        if (!formData.email) {
          newErrors.email = "Please fill the Email field.";
        } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
          newErrors.email = "Please enter a valid Email address.";
        }
        if (!formData.phone) newErrors.phone = "Phone is required.";
        break;

      case 3:
        if (!formData.address)
          newErrors.address = "Operational Address is required.";
        if (!formData.city) newErrors.city = "City is required.";
        if (!formData.country) newErrors.country = "Country is required.";
        break;

      case 4:
        if (!formData.registrationNumber)
          newErrors.registrationNumber = "Registration Number is required.";
        if (
          !formData.productCategories ||
          formData.productCategories.length === 0
        )
          newErrors.productCategories = "Select at least one Product Category.";
        if (!formData.documents)
          newErrors.documentSubmitted = "Please upload the Business Documents.";

        if (!isDocumentDownloaded) {
          newErrors.documentSubmitted =
            "Please download and submit the Terms and Conditions document.";
        }
        break;

      default:
        return false;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
    setErrors({});
  };

  const validateForm = () => {
    const error: Partial<Record<keyof FormData, string>> = {};

    if (!formData.companyName) {
      error.companyName = "Please fill the Business Name field.";
    }

    if (!formData.businessType) {
      error.businessType = "Please select the Business Type.";
    }

    if (!formData.contactPerson) {
      error.contactPerson = "Please fill the Contact Person field.";
    }

    if (!formData.email) {
      error.email = "Please fill the Email field.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      error.email = "Please enter a valid Email address.";
    }

    if (!formData.phone) {
      error.phone = "Please fill the Phone field.";
    }

    if (!formData.linkedin) {
      error.linkedin = "Please fill the LinkedIn field.";
    }

    if (!formData.twitter) {
      error.twitter = "Please fill the Twitter field.";
    }

    if (!formData.facebook) {
      error.facebook = "Please fill the Facebook field.";
    }

    if (!formData.instagram) {
      error.instagram = "Please fill the Instagram field.";
    }

    if (!formData.address) {
      error.address = "Please fill the Operational Address field.";
    }

    if (!formData.city) {
      error.city = "Please fill the City field.";
    }

    if (!formData.country) {
      error.country = "Please fill the Country field.";
    }

    if (!formData.registrationNumber) {
      error.registrationNumber = "Please fill the Registration Number field.";
    }

    if (
      !formData.productCategories ||
      formData.productCategories.length === 0
    ) {
      error.productCategories = "Please select at least one Product Category.";
    }

    if (!formData.documents) {
      error.documents = "Please upload Business Documents.";
    }
    if (!formData.termsDocuments) {
      error.documents = "Please upload downloaded Documents.";
    }

    if (!isDocumentDownloaded) {
      error.documents =
        "Please download and submit the Terms and Conditions document.";
    }

    return error;
  };

  // const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   const error = validateForm();
  //   const isStepValid = validateStep(step);

  //   if (isStepValid || Object.keys(error).length === 0) {
  //     setSubmitted(true);
  //     setError("");
  //     setErrors("");
  //     console.log("Form submitted:", formData);
  //   } else {
  //     console.log(error, errors);
  //     setErrors(errors);
  //     setError({});

  //   }
  // };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // const error = validateForm();
    const isStepValid = validateStep(step);

    if (isStepValid && Object.keys(error).length === 0) {
      setError("");
      setErrors({});

      console.log("Form submitted:", formData);

      try {
        const response = await fetch("/api/submitForm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Response from server:", data);
        setSubmitted(true);
      } catch (err) {
        setNotSubmitted(true);

        console.error("Error submitting form:", err);
      }
    } else {
      console.log("ERROR", error, errors);
      setErrors(errors);
      setError("");
    }
  };

  const handleDownload = () => {
    setIsDocumentDownloaded(true);
    window.location.href = "/Vendor-Agreement-Form.docx";
  };

  // const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: null }));
  };

  // Handle category selection
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // const target = e.target as HTMLInputElement;
    const value = e.target.value;
    if (!formData.productCategories?.includes(value)) {
      setFormData((prev) => ({
        ...prev,
        productCategories: [...(prev.productCategories || []), value],
      }));
      setErrors({ ...errors, productCategories: undefined });
    }
  };

  // Handle category removal
  const removeCategory = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      productCategories: (prev.productCategories || []).filter(
        (item) => item !== category
      ),
    }));
  };

  return (
    <div className="min-h-screen py-10 md:py-20 flex flex-col items-center justify-center bg-[#f2f4f7] ">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%] h-full divide-y-2 flex  flex-col items-center justify-center">
        <img src="/logo.webp" alt="" className="md:w-[30%] w-[50%]" />
        <div className="mx-auto  w-full">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center mt-3">
            Vendor Registration
          </h1>
          {/* Step indicator */}
          <div className="hidden md:flex justify-between mb-6 ">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`flex-1 text-center ${
                  step === i ? "text-[#43828d]" : "text-gray-400"
                }`}
              >
                <div className="flex flex-col items-center justify-center space-x-2.5">
                  <span
                    className={`flex items-center justify-center w-8 h-8 border ${
                      step === i ? "border-[#43828d]" : "border-gray-400"
                    } rounded-full shrink-0`}
                  >
                    {step > i ? <TiTick size={24} /> : i}
                  </span>
                  <span>
                    <h3 className="font-medium leading-tight">
                      {i === 1
                        ? "Business Info"
                        : i === 2
                        ? "Contact Info"
                        : i === 3
                        ? "Address Info"
                        : "Business Details"}
                    </h3>
                  </span>
                </div>
              </div>
            ))}
          </div>
          {/* {error && <p className="text-red-500  pl-6 font-semibold">{error}</p>} */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6  px-6  pb-6 hidden md:block"
          >
            {/* Step 1: Company Information */}
            {step === 1 && (
              <BusinessInfo
                formData={formData}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 2: Contact Information */}
            {step === 2 && (
              <ContactInfo
                formData={formData}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 3: Address Information */}
            {step === 3 && (
              <AddressInfo
                formData={formData}
                errors={errors}
                handleChange={handleChange}
              />
            )}

            {/* Step 4: Business Details */}
            {step === 4 && (
              <BusinessDetails
                formData={formData}
                errors={errors}
                handleChange={handleChange}
                handleCategoryChange={handleCategoryChange}
                removeCategory={removeCategory}
                handleDownload={handleDownload}
                setFormData={setFormData}
                isDocumentDownloaded={isDocumentDownloaded}
              />
            )}

            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  type="button"
                  className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
                  onClick={prevStep}
                >
                  Previous
                </button>
              )}

              {step < 4 && (
                <button
                  type="button"
                  className="bg-[#43828d] hover:bg-[#539dab] text-white px-4 py-2 rounded-md "
                  onClick={nextStep}
                >
                  Next
                </button>
              )}

              {step === 4 && (
                <button
                  type="submit"
                  className="bg-[#43828d] hover:bg-[#539dab] text-white px-4 py-2 rounded-md "
                >
                  Submit
                </button>
              )}
            </div>
          </form>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 px-2 pb-6 block md:hidden "
          >
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Business Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
                <div>
                  <label className="block text-sm  text-gray-700">
                    Business Name *
                  </label>
                  {errors.companyName && (
                    <span className="text-red-500 text-sm">
                      {errors.companyName}
                    </span>
                  )}
                  <input
                    type="text"
                    name="companyName"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] "
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm  text-gray-700">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    name="brandName"
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.brandName}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm  text-gray-700">
                  Business Type *
                </label>
                <select
                  name="businessType"
                  required
                  className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                  value={formData.businessType}
                  onChange={handleChange}
                >
                  <option value="manufacturer">Manufacturer</option>
                  <option value="supplier">Supplier</option>
                  <option value="distributor">Distributor</option>
                  <option value="wholesaler">Wholesaler</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm  text-gray-700">
                    Contact Person *
                  </label>
                  <input
                    type="text"
                    name="contactPerson"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.contactPerson}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm  text-gray-700">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm  text-gray-700">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label className="block text-sm  text-gray-700">
                    Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.website}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    LinkedIn *
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.linkedin}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Twitter *
                  </label>
                  <input
                    type="text"
                    name="twitter"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.twitter}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Facebook *
                  </label>
                  <input
                    type="text"
                    name="facebook"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.facebook}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Instagram *
                  </label>
                  <input
                    type="text"
                    name="instagram"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.instagram}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Address Information
              </h2>
              <div>
                <label className="block text-sm  text-gray-700">
                  Operational Address *
                </label>
                <textarea
                  name="address"
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm  text-gray-700">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm  text-gray-700">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                    value={formData.country}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">
                Business Details
              </h2>
              <div>
                <label className="block text-sm  text-gray-700">
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  required
                  className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm  text-gray-700">Tax ID</label>
                <input
                  type="text"
                  name="taxId"
                  className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
                  value={formData.taxId}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm  text-gray-700">
                  Product Categories *
                </label>
                <select
                  name="productCategories"
                  required
                  className="mt-1 block w-full rounded-md border px-4 py-2 outline-none focus:border-[#539dab] "
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
                            aria-label="remove category"
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
                <label className="block text-sm  text-gray-700">
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
                <label className="block text-sm  text-gray-700">
                  Business Documents
                </label>
                <input
                  type="file"
                  name="documents"
                  required
                  className="mt-1 block w-full rounded-md border px-3 py-2"
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
                <label className="block text-sm font-bold text-gray-700">
                  Policy
                </label>
                <label className="block text-sm font-medium text-gray-700">
                  Accept our Terms and Conditions to continue signing up
                </label>
                <div className="flex flex-col space-x-4 mt-1 items-end">
                  {/* Download Terms and Conditions */}
                  <div className="w-full">
                    <a
                      onClick={handleDownload}
                      className="mt-1 block w-full rounded-md border px-3 py-2 text-center bg-[#43828d] text-white cursor-pointer"
                    >
                      Download document
                    </a>
                  </div>

                  {/* Upload Business Documents */}
                  <div className="w-full">
                    <label className="block mt-2 text-sm font-medium text-gray-700">
                      Submit document *
                    </label>
                    <input
                      type="file"
                      name="documents"
                      required
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

            <div className="flex justify-between mt-6">
              <button
                type="submit"
                className="w-full bg-[#43828d] hover:bg-[#539dab] text-white px-4 py-2 rounded-md "
              >
                Submit
              </button>
            </div>
          </form>

          {/* Submission Modal */}
          {submitted ||
            (notSubmitted && (
              <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center ">
                <div className="bg-white p-8 rounded-lg shadow-lg h-[500px] w-[90%] md:w-[40%] flex justify-center items-center flex-col">
                  <CheckCircle2 className="text-green-600 size-20 mx-auto" />
                  <h2 className="text-4xl font-bold text-center mt-4">
                    Success!
                  </h2>
                  <p className="text-center mt-2 text-xl font-semibold">
                    You have successfully registered as a vendor
                  </p>

                  <a
                    onClick={() => {
                      setSubmitted(false);
                      window.location.href =
                        "https://inventory.zohosecure.com/portal/obanaafrica/signup#/send-invite";
                    }}
                    className="relative px-10 py-3 overflow-hidden font-medium text-white bg-[#43828d] border border-gray-100 rounded-lg shadow-inner group mt-4 cursor-pointer"
                  >
                    <span className="absolute top-0 left-0 w-0 h-0 transition-all duration-200 border-t-2 border-gray-600 group-hover:w-full ease"></span>
                    <span className="absolute bottom-0 right-0 w-0 h-0 transition-all duration-200 border-b-2 border-gray-600 group-hover:w-full ease"></span>
                    <span className="absolute top-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                    <span className="absolute bottom-0 left-0 w-full h-0 transition-all duration-300 delay-200 bg-gray-600 group-hover:h-full ease"></span>
                    <span className="absolute inset-0 w-full h-full duration-300 delay-300 bg-gray-900 opacity-0 group-hover:opacity-100"></span>
                    <span className="relative transition-colors duration-300 delay-200 group-hover:text-white ease">
                      Continue
                    </span>
                  </a>
                </div>
              </div>
            ))}

          {/* Error Modal */}
          {notSubmitted && (
            <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
              <div className="bg-red-100 p-8 rounded-lg shadow-lg h-[500px] w-[90%] md:w-[40%] flex justify-center items-center flex-col">
                <XCircle className="text-red-600 size-20 mx-auto" />
                <h2 className="text-4xl font-bold text-center mt-4">Error!</h2>
                <p className="text-center mt-2 text-xl font-semibold">
                  There was an error registering as a vendor. Please try again.
                </p>
                <button
                  onClick={() => {
                    setNotSubmitted(false);
                  }}
                  className="relative px-10 py-3 overflow-hidden font-medium text-white bg-red-600 border border-gray-100 rounded-lg shadow-inner group mt-4 cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorSignUp;
