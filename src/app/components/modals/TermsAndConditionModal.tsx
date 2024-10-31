import React from 'react';

interface TermsAndConditionModalProps {
  onClose: () => void;
  onAccept: () => void;
}

const TermsAndConditionModal: React.FC<TermsAndConditionModalProps> = ({ onClose , onAccept }) => {
  return (
    <div className="fixed inset-0 -top-10  z-50 flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white relative  overflow-auto p-6 rounded-lg w-11/12 max-h-[90%] md:w-[45%]">
        <button
          onClick={onClose}
          className="absolute text-4xl top-2 right-2 text-black"
        >
          &times;
        </button>
        <div>
          <h1 className="text-3xl font-bold text-center mb-4">
            Terms and Conditions
          </h1>
          <h2 className="text-lg font-bold mb-1">
            Effective Date: Insert Date
          </h2>
          <p>
            This Vendor Agreement is entered into between Obana Africa and the
            undersigned Vendor. By uploading documents and signing up on
            obana.africa, Vendor agrees to the terms and conditions outlined
            below
          </p>
          <div className="space-y-2 mt-4">
            {" "}
            <h2 className="text-xl font-bold">1. Definitions</h2>
            <p>
              <b>Vendor: </b> Refers to the business entity or individual
              registering to sell products through the platform.
            </p>
            <p>
              <b>Platform: </b> Refers to obana.africa, owned and operated by
              Icon Holding Africa, which facilitates the sale and distribution
              of Vendor products.
            </p>
          </div>
          <div className="space-y-2 mt-4">
            {" "}
            <h2 className="text-xl font-bold">
              2. Product Listings & Compliance
            </h2>
            <p>
              Product descriptions must be accurate, and all items must comply
              with relevant laws and regulations.
            </p>
            <p>
              Misleading descriptions or non-compliance may result in penalties
              or suspension from the Platform.
            </p>
          </div>

          <div className="space-y-2 mt-4">
            {" "}
            <h2 className="text-xl font-bold">3. Pricing & Payments</h2>
            <p>
              Vendors set their own prices, but the Platform may intervene in
              cases of unfair pricing.
            </p>
            <p>
              Payments will be made to Vendor accounts within agreed days base
              order flow, after deducting a service fee of 5% for Platform
              services.
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <h2 className="text-xl font-bold">4. Bank Account Details</h2>
            <p>
              Vendor must provide accurate bank account details for payment
              disbursement
            </p>
            <p>
              Bank Name, Account Name, Account Number & SWIFT Code (if
              applicable)
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <h2 className="text-xl font-bold">5. Termination</h2>
            <p>
              The Platform may suspend or terminate Vendor accounts for
              violations of this Agreement.
            </p>
            <p>
              Vendors may terminate their account within a 10 days notice period
              and must remove all products from the Platform.
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <h2 className="text-xl font-bold">6. Limitation of Liability</h2>
            <p>
              The Platform is not responsible for issues arising from product
              quality, delivery, or customer disputes. Vendors agree to
              indemnify the Platform from any claims related to their products.
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <h2 className="text-xl font-bold">7. Governing Law</h2>
            <p>
              This Agreement is governed by the laws of the Federal Republic of
              Nigeria.
            </p>
          </div>
          <div className="space-y-2 mt-4">
            <h2 className="text-xl font-bold">8. Acceptance</h2>
            <p>
              By accepting this conditions, the Vendor agrees to these terms to
              continue.
            </p>
          </div>

          <div className="flex justify-end mt-4 gap-4">
            <button
              className="bg-[#43828d] hover:bg-[#539dab]  text-white px-4 py-2 rounded"
              onClick={onAccept}
            >
              Accept
            </button>
            <button
              className="bg-red-500 hover:bg-red-800 text-white px-4 py-2 rounded"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionModal;
