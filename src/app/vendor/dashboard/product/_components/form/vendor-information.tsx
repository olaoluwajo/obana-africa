import React from "react";
import SelectInput from "../inputs/select-input";
import {TextInput} from "../inputs/text-input";

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
				<SelectInput
					control={control}
					name="incoterms"
					label="INCOTERMS"
					options={incotermsOptions}
					placeholder="Select incoterm..."
				/>
			</div>
		</div>
	);
};

export default VendorInformation;
