import React from "react";
import SelectInput from "../inputs/select-input";
import { TextInput } from "../inputs/text-input";
import { Controller } from "react-hook-form";

interface VendorInformationProps {
	control: any;
	fobOptions: any;
	incotermsOptions: any;
}

const VendorInformation: React.FC<VendorInformationProps> = ({
	control,
	fobOptions,
	incotermsOptions,
}) => {
	return (
		<div>
			<h1 className="text-2xl font-bold">Vendor Information</h1>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
				<TextInput
					control={control}
					name="tags"
					label="Tags"
					placeholder="Enter tags"
					type="text"
					tooltipContent="Type your product tag and add a comma to add a new tag."
				/>
				<SelectInput
					control={control}
					name="fob"
					label="FOB"
					options={fobOptions}
					placeholder="Enter FOB"
				/>
			</div>
			<div className="grid grid-cols-1 mt-4 gap-6 md:grid-cols-4">
				<SelectInput
					control={control}
					name="incoterms"
					label="INCOTERMS"
					options={incotermsOptions}
					placeholder="Select incoterm..."
				/>
				<div>
					<label className="block text-sm font-medium text-gray-700">
						Is Sample Available?
					</label>
					<Controller
						name="sampleAvailable"
						control={control}
						defaultValue="yes"
						render={({ field }) => (
							<select
								{...field}
								className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
								<option value="yes">Yes</option>
								<option value="no">No</option>
							</select>
						)}
					/>{" "}
				</div>
			</div>
		</div>
	);
};

export default VendorInformation;
