import React from "react";

interface OnboardingModalProps {
	isOpen: boolean;
	onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 transition-all duration-200">
			<div className="relative bg-slate-50 p-6 rounded shadow-md md:w-[45%] w-[80%] max-h-[90%] overflow-auto">
				<button onClick={onClose} className="absolute text-4xl top-2 right-2 text-black">
					&times;
				</button>
				<div>
					{" "}
					<h1 className="text-3xl font-bold mb-2 text-center">Vendor Onboarding Instructions</h1>
					<p className="mb-4">
						Welcome to <b>Obana Africa!</b> To ensure a smooth onboarding experience, please follow the steps outlined below. Once registered and approved, you’ll be able to list your products
						on our platform.
					</p>
					<h2 className="text-xl font-bold mb-2">Step 1: Vendor Registration</h2>
					<ul className="list-disc list-inside mb-4">
						<li>Complete the vendor registration form with accurate details.</li>
						<li>After submission, our team will review your application and notify you of approval status within 5 business days.</li>
					</ul>
					<h2 className="text-xl font-bold mb-2">Step 2: Product Upload Process</h2>
					<ul className="list-disc list-inside mb-4 space-y-2">
						<li>
							<b> Download the Product Sample Sheet: </b>
							Once approved, download the product sample sheet provided on your vendor dashboard.
						</li>

						<li>
							<b> Fill Out the Sheet Accurately: </b>
							Complete the sample sheet with all necessary product details, adhering to the required format.
						</li>

						<li>
							<b> Upload the Completed Product Sheet: </b>
							After filling out the sheet, upload it back to the portal. Our team will review the document for accuracy and completeness.
						</li>

						<li>
							<b> Product Listing Approval: </b>
							Upon successful review of your product information, our team will finalize and publish your products on the platform.
						</li>
					</ul>
					<div>
						<h2 className="text-xl font-bold mb-2">Important Notice</h2>
						<p>
							Please ensure that you have read and agreed to all <b className="text-red-500"> terms and conditions </b>before proceeding with product uploads.
						</p>
					</div>
					<p className="font-semibold"> Full access to the portal will only be granted after all onboarding requirements and agreements are met.</p>
				</div>
				<button onClick={onClose} className="mt-4 bg-primary hover:bg-primary-hover  text-white py-2 px-4 rounded w-full ">
					Continue
				</button>
			</div>
		</div>
	);
};

export default OnboardingModal;
