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

interface SizeTypeOption {
	type: string;
	categories: {
		name: string;
		subcategories: {
			name: string;
			sizes: string[];
		}[];
	}[];
}

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

	const sizeTypeOptions: SizeTypeOption[] = [
		{
			type: "Apparel",
			categories: [
				{
					name: "Men's",
					subcategories: [
						{ name: "Shirts", sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"] },
						{ name: "T-Shirts", sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"] },
						{ name: "Pants", sizes: ["28", "30", "32", "34", "36", "38", "40", "42", "44"] },
						{ name: "Shorts", sizes: ["S", "M", "L", "XL", "2XL"] },
						{ name: "Jackets/Coats", sizes: ["S", "M", "L", "XL", "2XL", "3XL"] },
						{ name: "Sweaters", sizes: ["S", "M", "L", "XL", "2XL"] },
						{ name: "Suits", sizes: ["36", "38", "40", "42", "44", "46", "48"] },
						{ name: "Vests", sizes: ["S", "M", "L", "XL", "2XL"] },
						{ name: "Polos", sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"] },
						{ name: "Tracksuits", sizes: ["S", "M", "L", "XL", "2XL"] },
					],
				},
				{
					name: "Women's",
					subcategories: [
						{ name: "Dresses", sizes: ["6", "8", "10", "12", "14", "16", "18", "20", "22"] },
						{ name: "Tops", sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"] },
						{ name: "Skirts", sizes: ["6", "8", "10", "12", "14", "16", "18", "20"] },
						{ name: "Pants", sizes: ["6", "8", "10", "12", "14", "16", "18", "20", "22"] },
						{ name: "Shorts", sizes: ["XS", "S", "M", "L", "XL"] },
						{ name: "Jackets/Coats", sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
						{ name: "Blouses", sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
						{ name: "Tunic Tops", sizes: ["XS", "S", "M", "L", "XL"] },
						{ name: "Leggings", sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
						{ name: "Cardigans", sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
					],
				},
				{
					name: "Unisex",
					subcategories: [
						{ name: "Hoodies", sizes: ["XS", "S", "M", "L", "XL", "2XL", "3XL"] },
						{ name: "Sweatshirts", sizes: ["XS", "S", "M", "L", "XL", "2XL"] },
						{ name: "Ponchos", sizes: ["S", "M", "L", "XL"] },
						{ name: "Kimono Jackets", sizes: ["S", "M", "L", "XL"] },
					],
				},
			],
		},
		{
			type: "Shoes",
			categories: [
				{
					name: "Men's Shoes",
					subcategories: [
						{
							name: "Casual Shoes/Boots",
							sizes: ["7", "8", "9", "10", "11", "12", "13", "14"],
						},
						{ name: "Dress Shoes", sizes: ["7", "8", "9", "10", "11", "12", "13"] },
						{ name: "Sports Shoes", sizes: ["7", "8", "9", "10", "11", "12", "13", "14"] },
						{ name: "Sandals/Flip Flops", sizes: ["7", "8", "9", "10", "11", "12"] },
					],
				},
				{
					name: "Women's Shoes",
					subcategories: [
						{ name: "Flats", sizes: ["5", "6", "7", "8", "9", "10", "11", "12"] },
						{ name: "Heels", sizes: ["5", "6", "7", "8", "9", "10", "11", "12"] },
						{ name: "Boots", sizes: ["5", "6", "7", "8", "9", "10", "11", "12"] },
						{ name: "Sports Shoes", sizes: ["5", "6", "7", "8", "9", "10", "11", "12"] },
						{ name: "Sandals/Flip Flops", sizes: ["5", "6", "7", "8", "9", "10", "11"] },
					],
				},
				{
					name: "Unisex Shoes",
					subcategories: [
						{ name: "Slippers", sizes: ["5", "6", "7", "8", "9", "10", "11", "12", "13"] },
						{ name: "Sneakers", sizes: ["7", "8", "9", "10", "11", "12"] },
					],
				},
			],
		},
		{
			type: "Accessories",
			categories: [
				{
					name: "Hats/Headwear",
					subcategories: [
						{ name: "Baseball Caps", sizes: ["One Size", "S/M", "M/L", "L/XL"] },
						{ name: "Beanies", sizes: ["One Size"] },
						{ name: "Fedoras", sizes: ["S", "M", "L", "XL"] },
						{ name: "Bucket Hats", sizes: ["One Size"] },
						{ name: "Sun Hats", sizes: ["One Size", "S/M", "M/L", "L/XL"] },
					],
				},
				{
					name: "Gloves",
					subcategories: [
						{ name: "Winter Gloves", sizes: ["S", "M", "L", "XL"] },
						{ name: "Leather Gloves", sizes: ["S", "M", "L", "XL"] },
						{ name: "Sports Gloves", sizes: ["S", "M", "L", "XL"] },
						{ name: "Fingerless Gloves", sizes: ["S", "M", "L", "XL"] },
					],
				},
				// Add other accessories categories as needed
			],
		},
	];

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
						<div className="flex gap-4 items-center ">
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

							{selectedType && (
								<div>
									<Select onValueChange={handleSelectCategory}>
										<SelectTrigger>
											<SelectValue placeholder="Select Category" />
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
					</div>
					{selectedCategory && (
						<div className="flex items-center ">
							{/* <FormLabel>Selected-type category</FormLabel> */}

							<Select onValueChange={handleSelectSubcategory}>
								<SelectTrigger>
									<SelectValue placeholder="Select Subcategory" />
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
