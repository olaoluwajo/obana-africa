import React, { useEffect } from "react";
import { TextInput } from "../inputs/text-input";
import { Controller, useWatch } from "react-hook-form";
import { MessageCircleQuestion } from "lucide-react";
import * as Tooltip from "@radix-ui/react-tooltip";

interface SalesInfoFormProps {
	control: any;
	productId: any;
	setValue: any;
	clearErrors: any;
	setError: any; 
}

const SalesInformation: React.FC<SalesInfoFormProps> = ({
	control,
	productId,
	setValue,
	clearErrors,
	setError,
}) => {
	// Watch the values of openingStockUnit and unitPerBox
	const watchOpeningStockUnit = useWatch({
		control,
		name: "openingStockUnit",
	});
	const watchUnitPerBox = useWatch({
		control,
		name: "unitPerBox",
	});

	useEffect(() => {
		if (watchOpeningStockUnit && watchUnitPerBox) {
			const calculatedStock = Number(watchOpeningStockUnit) / Number(watchUnitPerBox);

			// Check if the result is a whole number
			if (calculatedStock % 1 !== 0) {
				// Set form error for openingStock
				setError("openingStock", {
					type: "manual",
					message: `Opening Stock Unit must be a multiple of Units Per Box (${watchUnitPerBox})`,
				});
			} else {
				clearErrors("openingStock");
			}

			setValue("openingStock", calculatedStock.toFixed(2));
		} else {
			setValue("openingStock", "");
		}
	}, [watchOpeningStockUnit, watchUnitPerBox, clearErrors, setError, setValue]);

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
						required
						disabled
						tooltipContent="The rate at which you're going to sell this item exclusive of tax"
					/>
				</div>
				{/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<TextInput
						control={control}
						name="salesTaxRule"
						label="Sales Tax Rule"
						disabled
						placeholder="Select sales tax rule"
						type="text"
						tooltipContent="The tax rates will be automatically applied to transactions based on your default sales tax rule. If you want to apply a different tax rate for this item, select a sales tax rule."
					/>
				</div> */}

				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="grid grid-cols-2 gap-6">
						<TextInput
							control={control}
							name="openingStockUnit"
							label="Stock on Hand (Unit) *"
							placeholder="Enter stock on hand"
							type="number"
							required
							tooltipContent="Stock on Hand (Units): Enter the total quantity of items currently available in stock."
						/>
						<Controller
							name="openingStock"
							control={control}
							render={({ field, fieldState: { error } }) => (
								<div className="flex flex-col gap-2 mt-2">
									<label className="text-sm font-medium">
										Stock on Hand (Pack) *
										<Tooltip.Root>
											<Tooltip.Trigger>
												<MessageCircleQuestion
													size={12}
													className="text-black/40 mr-2"
												/>
											</Tooltip.Trigger>
											<Tooltip.Content
												side="right"
												sideOffset={10}
												className="bg-black/80 text-white px-2 py-1 rounded-md text-xs max-w-[200px]">
											  Stock on Hand (Pack): This is the total quantity of items currently available in stock, considering the number of items per pack. This value will be automatically calculated based on the Stock on Hand (Unit) and Units Per Box.
												<Tooltip.Arrow className="fill-black/80" />
											</Tooltip.Content>
										</Tooltip.Root>
									</label>
									<input
										{...field}
										type="number"
										disabled
										className={`cursor-not-allowed rounded-md border px-3 py-2 text-sm bg-gray-100 ${
											error
												? "border-red-500 focus:border-red-500"
												: "border-gray-300 focus:border-blue-500"
										}`}
										placeholder="Calculated stock"
									/>
									{error && <span className="text-xs text-red-500">{error.message}</span>}
								</div>
							)}
						/>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SalesInformation;
