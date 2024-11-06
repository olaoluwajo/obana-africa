// ErrorModal.tsx
import React from "react";
import { XCircle } from "lucide-react";

interface ErrorModalProps {
  onClose: () => void;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center">
      <div className="bg-red-100 p-8 rounded-lg shadow-lg h-[500px] w-[90%] md:w-[40%] flex justify-center items-center flex-col">
        <XCircle className="text-red-600 size-20 mx-auto" />
        <h2 className="text-4xl font-bold text-center mt-4">Error!</h2>
        <p className="text-center mt-2 text-xl font-semibold">
          There was an error registering as a vendor. Please try again.
        </p>
        <p className="text-center mt-2 text-sm font-semibold">
          Please Ensure all fields are filled correctly
        </p>
        <button
          onClick={onClose}
          className="relative px-10 py-3 overflow-hidden font-medium text-white bg-red-600 border border-gray-100 rounded-lg shadow-inner group mt-4 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
