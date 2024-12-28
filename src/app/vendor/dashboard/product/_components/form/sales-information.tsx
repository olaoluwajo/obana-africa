import React from "react";
import {TextInput} from "../inputs/text-input";
import {  Controller } from "react-hook-form";

interface SalesInfoFormProps {
	control: any;
	productId: any;
}

const SalesInformation: React.FC<SalesInfoFormProps> = ({ control, productId }) => {
	return (
		<div>
			<h1 className="text-2xl font-bold">Sales Information</h1>
			<div className="grid grid-cols-1 gap-6 md:grid-cols-1">
				<div className="grid grid-cols-2 gap-6 md:grid-cols-4">
					<TextInput
						control={control}
						name="unitPrice"
						label="Price per Unit"
						placeholder="Enter price..."
						type="number"
					/>
					<TextInput
						control={control}
						name="sellingPrice"
						label="Selling Price *"
						placeholder="Enter selling price"
						type="number"
						required={true}
						disabled={true}
						tooltipContent="The rate at which you're going to sell this item exclusive of tax"
					/>
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<TextInput
						control={control}
						name="salesTaxRule"
						label="Sales Tax Rule "
						placeholder="Select sales tax rule"
						type="text"
						tooltipContent="The tax rates will be automatically applied to transactions based on your default sales tax rule. If you want to apply a different tax rate for this item, select a sales tax rule."
					/>
				</div>

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="grid grid-cols-2 gap-6 md:grid-cols-2">
						{productId === "new" && (
							<TextInput
								control={control}
								name="openingStock"
								label="Opening Stock *"
								placeholder="Enter opening stock"
								type="number"
								required={true}
								tooltipContent="The number of initial stock of items available"
							/>
						)}
						<TextInput
							control={control}
							name="availableStock"
							label="Available to Sell"
							placeholder="Enter available stock"
							type="number"
							tooltipContent="The number of available stock of this product"
						/>
					</div>
				</div>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
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
						/>
					</div>
					{/* <div className="grid grid-cols-1 gap-6 md:grid-cols-4"> */}
					<div>
						<label className="block text-sm font-medium text-gray-700">
							Make Product Active
						</label>
						<Controller
							name="status"
							control={control}
							defaultValue="inactive"
							render={({ field }) => (
								<select
									{...field}
									className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
									<option value="active">Mark as active</option>
									{/* <option value="confirmation_pending">Mark as active</option> */}
									<option value="inactive">Mark as in-active</option>
								</select>
							)}
						/>
					</div>{" "}
				</div>
			</div>
			{/* </div> */}
		</div>
	);
};

export default SalesInformation;
