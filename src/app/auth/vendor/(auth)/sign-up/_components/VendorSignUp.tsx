"use client";
import React, { useEffect, useState } from "react";
import { TiTick } from "react-icons/ti";
import BusinessInfo from "./BusinessInfo";
import ContactInfo from "./contactInfo/ContactInfo";
import AddressInfo from "./addressInfo/AddressInfo";
import BusinessDetails from "./BusinessDetails";
import ErrorModal from "@/components/modals/ErrorModal";
import SuccessModal from "@/components/modals/SuccessModal";
import axios from "axios";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import Link from "next/link";

const VendorSignUp = () => {
	const [step, setStep] = useState(1);
	const [submitted, setSubmitted] = useState(false);
	const [notSubmitted, setNotSubmitted] = useState(false);
	const [loading, setLoading] = useState(false);
	const [mounted, setMounted] = useState(false);
	const router = useRouter();

	useEffect(() => {
		setMounted(true); // This will make sure the component is mounted
	}, []);

	useEffect(() => {
		if (mounted && router) {
			// Now it's safe to use the router (client-side rendering is done)
		}
	}, [mounted, router]);

	// const [error, setError] = useState("");
	const [isDocumentDownloaded, setIsDocumentDownloaded] = useState(false);
	const [errors, setErrors] = useState<ErrorsType>({});
	// const [formErrors, setFormErrors] = useState({});
	const [termsAccepted, setTermsAccepted] = useState(false);
	const handleTermsAccept = () => {
		setTermsAccepted(true);
	};

	const [formData, setFormData] = useState<FormData>({
		companyName: "",
		brandName: "",
		businessType: "",
		businessCategory: "",
		bankName: "",
		accountNumber: "",
		accountName: "",
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
		state: "",
		registrationNumber: "",
		taxId: "",
		productCategories: [],
		description: "",
		website: "",
		documents: null,
		termsDocuments: null,
		dataDocuments: [
			{
				documents: null,
				termsDocument: null,
			},
		],
	});
	interface DocumentType {
		documents?: any;
		termsDocument: any;
	}

	interface FormData {
		companyName?: string;
		brandName?: string;
		bankName?: string;
		accountNumber?: string;
		accountName?: string;
		businessType?: string;
		businessCategory?: string;
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
		state?: string;
		registrationNumber?: string;
		taxId?: string;
		productCategories?: string[] | undefined;
		description?: string;
		website?: string;
		dataDocuments?: DocumentType[];
		documents?: any;
		termsDocuments?: any;
		documentSubmitted?: string;
	}
	interface ErrorsType {
		country?: string;
		companyName?: string;
		brandName?: string;
		businessType?: string;
		businessCategory?: string;
		contactPerson?: string;
		email?: string;
		phone?: string;
		address?: string;
		instagram?: string;
		twitter?: string;
		facebook?: string;
		linkedin?: string;
		city?: string;
		registrationNumber?: string;
		taxId?: string;
		productCategories?: string;
		description?: string;
		website?: string;
		documents?: any;

		termsDocuments?: any;
		documentSubmitted?: string;
	}

	interface FormErrors extends Partial<Record<keyof FormData, string>> {
		documentSubmitted?: string;
	}

	const validateStep = (currentStep: number) => {
		const newErrors: Partial<ErrorsType> = {};

		switch (currentStep) {
			case 1:
				if (!formData.companyName) newErrors.companyName = "Company Name is required.";
				if (!formData.businessCategory)
					newErrors.businessCategory = "Business Category is required.";
				break;

			case 2:
				if (!formData.contactPerson) newErrors.contactPerson = "Contact Person is required.";
				if (!formData.email) {
					newErrors.email = "Please fill the Email field.";
				} else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
					newErrors.email = "Please enter a valid Email address.";
				}
				if (!formData.phone) newErrors.phone = "Phone is required.";
				break;

			case 3:
				if (!formData.address) newErrors.address = "Operational Address is required.";
				if (!formData.city) newErrors.city = "City is required.";
				if (!formData.country) newErrors.country = "Country is required.";
				break;

			case 4:
				if (!formData.registrationNumber)
					newErrors.registrationNumber = "Registration Number is required.";
				if (!formData.productCategories || formData.productCategories.length === 0)
					newErrors.productCategories = "Select at least one Product Category.";
				if (!formData.documents)
					newErrors.documentSubmitted = "Please upload the Business Documents.";
				if (!formData.termsDocuments)
					newErrors.documentSubmitted = "Please upload the Downloaded Documents.";

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
	const validateForm = () => {
		const newErrors: Partial<ErrorsType> = {};

		// Check required fields
		if (!formData.companyName) newErrors.companyName = "Company Name is required.";
		if (!formData.brandName) newErrors.brandName = "Brand Name is required.";
		if (!formData.businessCategory) newErrors.businessCategory = "Business Category is required.";

		if (!formData.contactPerson) newErrors.contactPerson = "Contact Person is required.";

		if (!formData.email) {
			newErrors.email = "Please fill the Email field.";
		} else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
			newErrors.email = "Please enter a valid Email address.";
		}

		if (!formData.phone) newErrors.phone = "Phone is required.";

		if (!formData.address) newErrors.address = "Operational Address is required.";
		if (!formData.city) newErrors.city = "City is required.";
		if (!formData.country) newErrors.country = "Country is required.";

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

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!termsAccepted) {
			setNotSubmitted(true);
			return;
		}

		const isStepValid = validateStep(step);
		const isFormValid = validateForm();

		if (isStepValid || isFormValid) {
			setErrors({});
			setLoading(true);

			// console.log("Form submitted:", formData);

			try {
				const response = await axios.post("/api/submitForm", formData, {
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (response.status !== 200) {
					throw new Error(`Error: ${response.status} - ${response.statusText}`);
				}

				setSubmitted(true);
				useAuthStore.getState().setAuthenticated(true);

				if (mounted && router) {
					router.push("/vendor/dashboard");
				}
				router.push("/vendor/dashboard");
			} catch (err) {
				console.error("Error submitting form:", err);
				setNotSubmitted(true);
			} finally {
				setLoading(false);
			}
		} else {
			// console.log("ERROR", errors);
			setErrors(errors);
		}
	};
	if (!mounted) {
		return null;
	}

	const handleDownload = () => {
		setIsDocumentDownloaded(true);
		window.location.href = "/Vendor-Agreement-Form.docx";
	};

	// const handleChange = (e: React.FormEvent<HTMLFormElement>) => {
	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
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
			productCategories: (prev.productCategories || []).filter((item) => item !== category),
		}));
	};

	// Function to accept terms

	return (
		<div className="min-h-screen py-10 md:py-20 flex flex-col items-center justify-center bg-[#f2f4f7] ">
			<div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[50%] h-full divide-y-2 flex  flex-col items-center justify-center">
				<img src="/logo.webp" alt="" className="md:w-[30%] w-[50%] mb-2" />
				<div className="mx-auto  w-full">
					<h1 className="text-2xl font-bold mb-6 text-black text-center mt-3">
						Vendor Registration
					</h1>
					{/* Step indicator */}
					<div className="hidden md:flex justify-between mb-6 ">
						{[1, 2, 3, 4].map((i) => (
							<div
								key={i}
								className={`flex-1 text-center ${
									step === i ? "text-primary" : "text-gray-400"
								}`}>
								<div className="flex flex-col items-center justify-center space-x-2.5">
									<span
										className={`flex items-center justify-center w-8 h-8 border ${
											step === i ? "border-primary" : "border-gray-400"
										} rounded-full shrink-0`}>
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
						autoComplete="off"
						onSubmit={handleSubmit}
						className="space-y-6  px-6  pb-6  md:block">
						<div className="hidden md:block">
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
									setFormData={setFormData}
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
									handleTermsAccept={handleTermsAccept}
									termsAccepted={termsAccepted}
								/>
							)}
						</div>
						<div className="block md:hidden">
							<BusinessInfo
								formData={formData}
								errors={errors}
								handleChange={handleChange}
							/>
							<ContactInfo formData={formData} errors={errors} handleChange={handleChange} />
							<AddressInfo
								setFormData={setFormData}
								formData={formData}
								errors={errors}
								handleChange={handleChange}
							/>
							<BusinessDetails
								formData={formData}
								errors={errors}
								handleChange={handleChange}
								handleCategoryChange={handleCategoryChange}
								removeCategory={removeCategory}
								handleDownload={handleDownload}
								setFormData={setFormData}
								isDocumentDownloaded={isDocumentDownloaded}
								handleTermsAccept={handleTermsAccept}
								termsAccepted={termsAccepted}
							/>
						</div>

						<div className=" justify-between mt-6 hidden md:flex">
							{step > 1 && (
								<button
									type="button"
									className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500"
									onClick={prevStep}>
									Previous
								</button>
							)}
							{step == 1 && (
								<div className="flex justify-center items-center">
									<p className=" text-center text-sm text-muted-foreground">
										Already have an account?
										<Link href="/auth/vendor/sign-in" className="font-bold ">
											Sign in
										</Link>
									</p>
								</div>
							)}

							{step < 4 && (
								<button
									type="button"
									className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md "
									onClick={nextStep}>
									Next
								</button>
							)}

							{step === 4 && (
								<button
									disabled={loading}
									type="submit"
									className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md ">
									{loading ? "Submitting..." : "Submit"}
								</button>
							)}
						</div>
						<div className="w-full  mt-6 block md:hidden">
							<button
								disabled={loading}
								type="submit"
								className="bg-primary hover:bg-primary-hover w-full text-white px-4 py-2 rounded-md ">
								{loading ? "Submitting..." : "Submit"}
							</button>
						</div>
					</form>

					{submitted && <SuccessModal onClose={() => setSubmitted(false)} href="/dashboard" />}
					{notSubmitted && <ErrorModal onClose={() => setNotSubmitted(false)} />}
				</div>
			</div>
		</div>
	);
};

export default VendorSignUp;
