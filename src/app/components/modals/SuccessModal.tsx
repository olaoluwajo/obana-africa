// SuccessModal.tsx
import React from "react";
import { CheckCircle2 } from "lucide-react";

interface SuccessModalProps {
  onClose: () => void;
  href: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ onClose, href }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center ">
      <div className="bg-white p-8 rounded-lg shadow-lg h-[500px] w-[90%] md:w-[40%] flex justify-center items-center flex-col">
        <CheckCircle2 className="text-green-600 size-20 mx-auto" />
        <h2 className="text-4xl font-bold text-center mt-4">Success!</h2>
        <p className="text-center mt-2 text-xl font-semibold">
          You have successfully registered as a vendor
        </p>
        <p className="text-center mt-2 text-md font-semibold">
          Your vendor portal will enabled, once you application is approved.
        </p>

        <a
          onClick={onClose}
          href={href}
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
  );
};

export default SuccessModal;
