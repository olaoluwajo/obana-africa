import React, { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormLabel, FormItem } from "@/components/ui/form";

interface SizeTypeOption {
	type: string;
	sizes: string[];
}

interface SizeSelectorProps {
	onValuesChange: (type: string, sizes: string[]) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ onValuesChange }) => {
	const [selectedType, setSelectedType] = useState<string>("");
	const [sizeOptions, setSizeOptions] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

	const sizeTypeOptions: SizeTypeOption[] = [
		{ type: "Shirt", sizes: ["M", "L", "LG", "XL", "XXL"] },
		{ type: "Shoe", sizes: ["21", "22", "33", "44", "55"] },
		{ type: "Shorts", sizes: ["S", "M", "L", "XL"] },
		{ type: "Accessories", sizes: ["One Size"] },
	];

	// Handle size type selection
	const handleSelectType = (type: string) => {
		setSelectedType(type);
		const typeInfo = sizeTypeOptions.find((option) => option.type === type);
		if (typeInfo) {
			setSizeOptions(typeInfo.sizes);
			setSelectedSizes([]);
		}
	};

	// Add a size to the selected sizes
	const handleSelectSize = (size: string) => {
		if (!selectedSizes.includes(size)) {
			const updatedSizes = [...selectedSizes, size];
			setSelectedSizes(updatedSizes);
			onValuesChange(selectedType, updatedSizes);
		}
	};

	// Remove a size from the selected sizes
	const handleRemoveSize = (size: string) => {
		const updatedSizes = selectedSizes.filter((s) => s !== size);
		setSelectedSizes(updatedSizes);
		onValuesChange(selectedType, updatedSizes);
	};

	// Update the parent component with selected type and sizes
	useEffect(() => {
		onValuesChange(selectedType, selectedSizes);
	}, [selectedType, selectedSizes, onValuesChange]);

	return (
    <div>
      <FormItem>
				<FormLabel>Size Type</FormLabel>{" "}
			<div className="mb-4">
				<Select onValueChange={handleSelectType}>
					<SelectTrigger>
						<SelectValue placeholder="Select Size Type" />
					</SelectTrigger>
					<SelectContent>
						{sizeTypeOptions.map((option) => (
							<SelectItem key={option.type} value={option.type}>
								{option.type}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Render size options dynamically */}
			{sizeOptions.length > 0 && (
				<div className="mb-4  ">
					<label className="block font-medium text-gray-700 text-xs">Select Sizes</label>
					<div className="flex flex-wrap gap-2 mt-2 text-xs">
						{sizeOptions.map((size) => (
							<button
								key={size}
								type="button"
								className={`px-2 py-1 rounded-full ${
									selectedSizes.includes(size) ? "bg-blue-500 text-white" : "bg-gray-200"
								}`}
								onClick={() => handleSelectSize(size)}>
								{size}
							</button>
						))}
					</div>
				</div>
			)}

			{/* Display selected sizes */}
			{selectedSizes.length > 0 && (
				<div className="mt-2">
					<label className="block font-medium text-gray-700 text-xs">Selected Sizes</label>
					<div className="flex flex-wrap gap-2 mt-2">
						{selectedSizes.map((size) => (
							<div
								key={size}
								className="px-2 py-1 bg-gray-200 rounded-full flex items-center space-x-2 text-xs">
								<span>{size}</span>
								<button
									type="button"
									className="text-red-500"
									onClick={() => handleRemoveSize(size)}>
									×
								</button>
							</div>
						))}
					</div>
				</div>
        )}
        </FormItem>
		</div>
	);
};

export default SizeSelector;
