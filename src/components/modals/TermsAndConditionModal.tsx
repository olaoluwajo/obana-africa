import React from "react";

interface TermsAndConditionModalProps {
	onClose: () => void;
	onAccept: () => void;
}

const terms = [
	{
		title: "Vendor Responsibilities",
		paragraphs: [
			"Vendors must provide accurate and up-to-date information about themselves and their products.",
			"Any changes to vendor details (such as contact info or business address) must be promptly updated in the system.",
		],
	},
	{
		title: "Product Information and Listing Requirements",
		paragraphs: [
			"Vendors are required to adhere to all product listing guidelines, ensuring all data (product descriptions, pricing, etc.) is accurate.",
			"Product samples may be requested for verification to maintain quality standards.",
		],
	},
	{
		title: "Order Fulfillment and Customer Service",
		paragraphs: [
			"Vendors must process and fulfill orders promptly, adhering to expected delivery times.",
			"Providing excellent customer service is expected, including responding to customer inquiries or complaints in a timely manner.",
		],
	},
	{
		title: "Fees and Payment Policies",
		paragraphs: [
			"Fees for listing, transaction processing, and other services may apply. These fees will be clearly communicated on the vendor dashboard.",
			" Payments for completed transactions will be disbursed according to Obana.africa’s standard payout schedule.",
		],
	},
	{
		title: "Compliance and Legal Standards",
		paragraphs: [
			"Vendors must comply with all relevant local, regional, and international laws and regulations related to their products and business practices.",
			"Prohibited items and restricted products cannot be listed. Violations may result in penalties or removal from the platform.",
		],
	},
	{
		title: "Account Termination",
		paragraphs: ["Obana.africa reserves the right to suspend or terminate vendor accounts for violations of these terms, poor performance, or failure to meet platform standards."],
	},
	{
		title: "Changes to Terms",
		paragraphs: [
			"Obana.africa may update these terms and conditions as necessary. Vendors will be notified of major changes, and continued use of the platform constitutes acceptance of updated terms.",
		],
	},
	{
		title: "Acceptance",
		paragraphs: ["By accepting this conditions, the Vendor agrees to these terms to continue."],
	},
];

const TermsAndConditionModal: React.FC<TermsAndConditionModalProps> = ({ onClose, onAccept }) => {
	return (
		<div className="fixed inset-0 -top-10  z-50 flex items-center justify-center bg-black bg-opacity-70">
			<div className="bg-white relative  overflow-auto p-6 rounded-lg w-11/12 max-h-[90%] md:w-[45%]">
				<button onClick={onClose} className="absolute text-4xl top-2 right-2 text-black">
					&times;
				</button>
				<div>
					<h1 className="text-3xl font-bold text-center mb-4">Terms and Conditions</h1>
					{/* <h2 className="text-lg font-bold mb-1">Effective Date: Insert Date</h2> */}
					<p>
						Welcome to Obana.africa! By onboarding as a vendor, you agree to the following terms and conditions that help maintain a reliable and secure marketplace. Please review each section
						carefully.
					</p>
					{terms.map((term, index) => (
						<div key={index} className="space-y-2 mt-4">
							<h2 className="text-xl font-bold">
								{index + 1}. {term.title}
							</h2>
							{term.paragraphs.map((paragraph, pIndex) => (
								<p key={pIndex}>- {paragraph}</p>
							))}
						</div>
					))}

					<div className="flex justify-end mt-4 gap-4">
						<button className="bg-[#43828d] hover:bg-[#539dab]  text-white px-4 py-2 rounded" onClick={onAccept}>
							Accept
						</button>
						<button className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded" onClick={onClose}>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TermsAndConditionModal;
