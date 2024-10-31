import { ChangeEvent, useState, useRef } from "react";
import CountryCodeSelector from "./CountryCode";



interface PhoneInputProps {
  formData: {
    phone?: string;
  };
  errors: {
    phone?: string;
  };
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}


const PhoneInput: React.FC<PhoneInputProps> = ({
  formData,
  errors,
  handleChange,
}) => {
  const [countryCode, setCountryCode] = useState("+1");
   const phoneInputRef = useRef<HTMLInputElement>(null);

    const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
      // Combine country code and phone number
      const fullPhoneNumber = `${countryCode} ${e.target.value}`;
      handleChange({ ...e, target: { ...e.target, value: fullPhoneNumber } });

      console.log(fullPhoneNumber)
    };


  return (
    <div className="relative flex items-center">
      {/* Wrapper with relative position */}
      <CountryCodeSelector onCodeSelect={setCountryCode} />
      <input
        ref={phoneInputRef}
        type="tel"
        placeholder="Enter phone number"
        value={formData.phone?.replace(countryCode, "")}
        onChange={handlePhoneChange}
        className={`pl-16 mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
          errors.phone ? "border-red-500" : ""
        }`}
      />
    </div>
  );
};

export default PhoneInput;
