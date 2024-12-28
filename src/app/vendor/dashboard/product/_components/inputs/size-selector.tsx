import React, { useState, useEffect } from "react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormLabel, FormItem } from "@/components/ui/form";
import * as Tooltip from "@radix-ui/react-tooltip";
import { MessageCircleQuestion } from "lucide-react";
import { sizeTypeOptions } from "@/constants/optionsData";

interface SizeSelectorProps {
	onValuesChange: (type: string, sizes: string[]) => void;
	tooltipContent?: string;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({ onValuesChange, tooltipContent }) => {
	const [selectedType, setSelectedType] = useState<string>("");
	const [selectedCategory, setSelectedCategory] = useState<string>("");
	const [selectedSubcategory, setSelectedSubcategory] = useState<string>("");
	const [sizeOptions, setSizeOptions] = useState<string[]>([]);
	const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

	const handleSelectType = (type: string) => {
		setSelectedType(type);
		setSelectedCategory("");
		setSelectedSubcategory("");
		setSelectedSizes([]);
		setSizeOptions([]);
	};

	const handleSelectCategory = (category: string) => {
		setSelectedCategory(category);
		setSelectedSubcategory("");
		setSelectedSizes([]);
		setSizeOptions([]);
	};

	const handleSelectSubcategory = (subcategory: string) => {
		setSelectedSubcategory(subcategory);
		const subcategoryInfo = sizeTypeOptions
			.find((option) => option.type === selectedType)
			?.categories.find((c) => c.name === selectedCategory)
			?.subcategories.find((sub) => sub.name === subcategory);
		if (subcategoryInfo) setSizeOptions(subcategoryInfo.sizes);
		setSelectedSizes([]);
	};

	const handleSelectSize = (e: React.MouseEvent<HTMLButtonElement>, size: string) => {
		e.preventDefault(); // Prevent form submission
		if (!selectedSizes.includes(size)) {
			const updatedSizes = [...selectedSizes, size];
			setSelectedSizes(updatedSizes);
			onValuesChange(selectedType, updatedSizes);
		}
	};

	const handleRemoveSize = (e: React.MouseEvent<HTMLButtonElement>, size: string) => {
		e.preventDefault(); // Prevent form submission
		const updatedSizes = selectedSizes.filter((s) => s !== size);
		setSelectedSizes(updatedSizes);
		onValuesChange(selectedType, updatedSizes);
	};

	useEffect(() => {
		onValuesChange(selectedType, selectedSizes);
	}, [selectedType, selectedSizes, onValuesChange]);

	return (
		<div className="col-span-2">
			<FormItem>
				<div className="flex gap-4 items-end">
					<div className="col-span-2">
						<FormLabel>Size Type</FormLabel>
						{tooltipContent && (
							<Tooltip.Root>
								<Tooltip.Trigger>
									<MessageCircleQuestion size={12} className="text-black/40 mr-2" />
								</Tooltip.Trigger>
								<Tooltip.Content
									side="top"
									sideOffset={2}
									className="bg-black/80 text-white px-2 py-1 rounded-md text-xs max-w-[200px]">
									{tooltipContent}
									<Tooltip.Arrow className="fill-black/80" />
								</Tooltip.Content>
							</Tooltip.Root>
						)}

						<Select onValueChange={handleSelectType}>
							<SelectTrigger>
								<SelectValue placeholder="Select Size Type" className="text-xs" />
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
					<div className="flex gap-4 items-center ">
						{selectedType && (
							<div>
								<Select onValueChange={handleSelectCategory}>
									<SelectTrigger>
										<SelectValue placeholder="Select type" />
									</SelectTrigger>
									<SelectContent>
										{sizeTypeOptions
											.find((option) => option.type === selectedType)
											?.categories.map((category) => (
												<SelectItem key={category.name} value={category.name}>
													{category.name}
												</SelectItem>
											))}
									</SelectContent>
								</Select>
							</div>
						)}
					</div>

					{selectedCategory && (
						<div className="flex items-center ">
							{/* <FormLabel>Selected-type category</FormLabel> */}

							<Select onValueChange={handleSelectSubcategory}>
								<SelectTrigger>
									<SelectValue placeholder="Select sub-type" />
								</SelectTrigger>
								<SelectContent>
									{sizeTypeOptions
										.find((option) => option.type === selectedType)
										?.categories.find((c) => c.name === selectedCategory)
										?.subcategories.map((sub) => (
											<SelectItem key={sub.name} value={sub.name}>
												{sub.name}
											</SelectItem>
										))}
								</SelectContent>
							</Select>
						</div>
					)}
				</div>
				{sizeOptions.length > 0 && (
					<div className="flex gap-8 items-center mb-4">
						<div>
							<FormLabel>Select Sizes</FormLabel>
							<div className="flex flex-wrap gap-2 mt-2">
								{sizeOptions.map((size) => (
									<button
										key={size}
										onClick={(e) => handleSelectSize(e, size)}
										className={`px-3 py-1 border rounded ${
											selectedSizes.includes(size)
												? "bg-blue-500 text-white"
												: "bg-gray-100"
										}`}>
										{size}
									</button>
								))}
							</div>{" "}
						</div>
						<div className="flex flex-wrap gap-2 mt-2">
							<div>
								<FormLabel>Your Selected Sizes</FormLabel>
								<div className="flex flex-wrap gap-2 mt-2">
									{selectedSizes.map((size) => (
										<button
											key={size}
											onClick={(e) => handleRemoveSize(e, size)}
											className="px-3 py-1 bg-red-500 text-white rounded">
											{size} ✕
										</button>
									))}
								</div>
							</div>
						</div>
					</div>
				)}
			</FormItem>
		</div>
	);
};

export default SizeSelector;
