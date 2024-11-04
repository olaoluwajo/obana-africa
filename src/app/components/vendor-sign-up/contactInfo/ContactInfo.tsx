import React from "react";
import PhoneInput from "./PhoneInput";

interface VendorFormData {
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}

interface Errors {
  contactPerson?: string;
  email?: string;
  phone?: string;
  website?: string;
  twitter?: string;
  linkedin?: string;
  facebook?: string;
  instagram?: string;
}

interface ContactInfoProps {
  formData: VendorFormData;
  errors: Errors;
  handleChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
}

const ContactInfo: React.FC<ContactInfoProps> = ({
  formData,
  errors,
  handleChange,
}) => (
  <div className="space-y-4">
    <h2 className="text-xl font-semibold text-gray-700">Contact Information</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Contact Person *
        </label>
        {errors.contactPerson && (
          <p className="text-red-500 text-sm">{errors.contactPerson}</p>
        )}
        <input
          type="text"
          name="contactPerson"
          required
          placeholder="Firstname Lastname"
          className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
            errors.contactPerson ? "border-red-500" : ""
          }`}
          value={formData.contactPerson}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email *
        </label>
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
        <input
          type="email"
          name="email"
          required
          placeholder="e.g johnDoe@gmail.com"
          className={`mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab] ${
            errors.email ? "border-red-500" : ""
          }`}
          value={formData.email}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Phone *
        </label>
        {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
         <PhoneInput
          value={formData.phone || ""}
          onChange={(phone) =>
            handleChange({
              target: { name: "phone", value: phone },
            } as React.ChangeEvent<HTMLInputElement>)
          }
        />
      
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Website
        </label>
        <input
          type="text"
          name="website"
          placeholder="e.g. https://www.johnDoe.cm"
          className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
          value={formData.website}
          onChange={handleChange}
        />
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          LinkedIn
        </label>
        <input
          type="text"
          name="linkedin"
          className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
          value={formData.linkedin}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Twitter Name
        </label>
        <input
          type="text"
          name="twitter"
          placeholder="e.g. johnDoe"
          className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
          value={formData.twitter}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Facebook
        </label>
        <input
          type="text"
          name="facebook"
          className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
          value={formData.facebook}
          onChange={handleChange}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Instagram
        </label>
        <input
          type="text"
          name="instagram"
          className="mt-1 block w-full rounded-md border px-3 py-2 outline-none focus:border-[#539dab]"
          value={formData.instagram}
          onChange={handleChange}
        />
      </div>
    </div>
  </div>
);

export default ContactInfo;
