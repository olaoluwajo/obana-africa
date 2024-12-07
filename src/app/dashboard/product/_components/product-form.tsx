"use client";
import * as React from "react";

import { FileUploader } from "@/components/file-uploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Product } from "@/constants/mock-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import * as Tooltip from "@radix-ui/react-tooltip";
import { MessageCircleQuestion } from "lucide-react";
import { brandOptions, manufacturerOptions, unitOptions } from "@/constants/optionsData";
import TextInput from "./inputs/text-input";
import SelectInput from "./inputs/select-input";
import CategoryInput from "./inputs/category-input";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
	image: z
		.any()
		.optional()
		.refine((files) => files?.length == 1, "Image is required.")
		.optional()
		.refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
		.optional()
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			".jpg, .jpeg, .png and .webp files are accepted.",
		)
		.optional(),
	name: z.string().min(5, {
		message: "Product name must be at least 5 characters.",
	}),
	sku: z.string().min(5, {
		message: "SKU must be at least 5 characters.",
	}),
	unit: z.string().min(1, {
		message: "Unit is required.",
	}),
	sellingPrice: z.string().min(1, {
		message: "Selling price is required.",
	}),
	account: z.string().min(1, {
		message: "Account is required.",
	}),
	salesTaxRule: z.string().optional(),
	category: z.string({
		message: "Please select a Category.",
	}),
	subCategory: z.string({
		message: "Please select a Sub Category.",
	}),
	subSubCategory: z.string({
		message: "Please select a Sub Sub Category.",
	}),
	unitPrice: z.any().optional(),
	description: z.string().optional(),
	manufacturer: z.string().optional(),
	brand: z.string().optional(),
	availableColors: z.string().optional(),
	tags: z.string().optional(),
	weight: z
		.object({
			value: z.any().optional(),
			unit: z.string().optional(),
		})
		.optional(),
	upc: z.any().optional(),
	mpn: z.any().optional(),
	ean: z.any().optional(),
	isbn: z.any().optional(),
	fob: z.any().optional(),
});

export default function ProductForm({
	initialData,
	pageTitle,
}: {
	initialData: Product | null;
	pageTitle: string;
}) {
	const defaultValues = {
		name: initialData?.name || "",
		sku: initialData?.sku || "",
		unit: initialData?.unit || "",
		category: initialData?.category || "",
		subCategory: initialData?.subCategory || "",
		subSubCategory: initialData?.subSubCategory || "",
		sellingPrice: initialData?.sellingPrice || "",
		account: initialData?.account || "Sales",
		salesTaxRule: initialData?.salesTaxRule || "",
		description: initialData?.description || "",
		unitPrice: initialData?.unitPrice || "",
		availableColors: initialData?.availableColors || "",
		tags: initialData?.tags || "",
		weight: {
			value: initialData?.weight || "",
			unit: "kg",
		},
		upc: initialData?.upc || "",
		mpn: initialData?.mpn || "",
		ean: initialData?.ean || "",
		isbn: initialData?.isbn || "",
		fob: initialData?.fob || "",
		manufacturer: initialData?.manufacturer || "",
		brand: initialData?.brand || "",
	};

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: defaultValues,
	});

	// State for dynamic category, subcategory, and sub-subcategory options
	const [selectedCategory, setSelectedCategory] = useState(defaultValues.category || "");
	const [selectedUnit, setSelectedUnit] = useState(defaultValues.unit || "");
	const [selectedSubCategory, setSelectedSubCategory] = useState(defaultValues.subCategory || "");
	const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(
		defaultValues.subSubCategory || "",
	);
	const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);
	const [availableSubSubCategories, setAvailableSubSubCategories] = useState<string[]>([]);
	const [selectedManufacturer, setSelectedManufacturer] = useState(
		defaultValues.manufacturer || "",
	);
	const [selectedBrand, setSelectedBrand] = useState(defaultValues.brand || "");
	const [loading, setLoading] = useState(false);

	const categoryOptions = [
		{ value: "beauty", label: "Beauty Products", subCategories: ["Beauty"] },
		{ value: "fashion", label: "Fashion", subCategories: ["Men", "Women"] },
		{ value: "lifestyle", label: "Lifestyle", subCategories: ["Electronics", "Headsets"] },
	];

	const subCategoryOptions = {
		beauty: ["Beauty"],
		fashion: ["Men", "Women"],
		lifestyle: ["Electronics", "Headsets"],
	};

	const subSubCategoryOptions = {
		Beauty: ["Face Wash", "Moisturizers", "Hair Care", "Skin Care"],
		Electronics: ["Phones", "Laptops"],
		Headsets: ["Headphones", "Earbuds"],
		Men: [
			"T-shirts",
			"Jeans",
			"Shorts",
			"Assesories",
			"Sneakers",
			"Trousers",
			"Sweatshirts",
			"Polos",
			"Hoodies",
			"Jackets",
			"Sweatpants",
		],
		Women: ["Dresses", "Shirts", "Skirts", "Assesories"],
	};
	// Handle category selection change
	const handleCategoryChange = (category: any) => {
		setSelectedCategory(category);
		setAvailableSubCategories(
			subCategoryOptions[category as keyof typeof subCategoryOptions] || [],
		);
		setSelectedSubCategory("");
		setAvailableSubSubCategories([]);
	};

	// Handle subcategory selection change
	const handleSubCategoryChange = (subCategory: any) => {
		setSelectedSubCategory(subCategory);
		setAvailableSubSubCategories(
			subSubCategoryOptions[subCategory as keyof typeof subSubCategoryOptions] || [],
		);
	};

	// Handle sub-subcategory selection change
	const handleSubSubCategoryChange = (subSubCategory: any) => {
		setSelectedSubSubCategory(subSubCategory);
	};

	// Handle unit selection change
	const handleUnitChange = (unit: any) => {
		setSelectedUnit(unit);
	};

	// Handle manufacturer selection change
	const handleManufacturerChange = (manufacturer: any) => {
		setSelectedManufacturer(manufacturer);
	};

	// Handle brand selection change
	const handleBrandChange = (brand: any) => {
		setSelectedBrand(brand);
	};

	function onSubmit(values: z.infer<typeof formSchema>) {
		console.log(values);
	}

	return (
		<Card className="mx-auto w-full">
			<CardHeader>
				<CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						<FormField
							control={form.control}
							name="image"
							render={({ field }) => (
								<div className="space-y-6">
									<FormItem className="w-full">
										<FormLabel>Images</FormLabel>
										<FormControl>
											<FileUploader
												value={field.value}
												onValueChange={field.onChange}
												maxFiles={8}
												maxSize={4 * 1024 * 1024}
												// disabled={loading}
												// progresses={progresses}
												// pass the onUpload function here for direct upload
												// onUpload={uploadFiles}
												// disabled={isUploading}
											/>
										</FormControl>
										<Separator />
										<FormMessage />
									</FormItem>
								</div>
							)}
						/>

						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<TextInput
								control={form.control}
								name="name"
								label="Product Name *"
								placeholder="Enter Product name"
								type="text"
								required={true}
							/>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<TextInput
									control={form.control}
									name="sku"
									label="SKU *"
									placeholder="Enter SKU"
									type="text"
									required={true}
									tooltipContent="The Stock Keeping Unit of the item"
								/>

								<FormField
									control={form.control}
									name="unit"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-red-500">Unit *</FormLabel>
											<FormControl>
												<Tooltip.Root>
													<Tooltip.Trigger>
														<MessageCircleQuestion
															size={12}
															className="text-black/40 mr-2"
														/>
													</Tooltip.Trigger>
													<Tooltip.Content
														side="top"
														sideOffset={10}
														className="bg-black/80 text-white px-2 py-1 rounded-md text-xs max-w-[200px]">
														The item will be measured in terms of this unit (e.g.: kg,
														dozen)
														<Tooltip.Arrow className="fill-black/80" />
													</Tooltip.Content>
												</Tooltip.Root>
											</FormControl>
											<Select
												value={selectedUnit}
												onValueChange={(value) => {
													handleUnitChange(value);
													field.onChange(value);
												}}>
												<SelectTrigger className="relative ">
													<Input
														placeholder="Select a Unit"
														className={`${
															!field.value
																? "absolute"
																: "hidden"
														} p-2 border-none bg-transparent z-10`}
													/>
												</SelectTrigger>

												<SelectContent>
													{unitOptions.map((unit) => (
														<SelectItem key={unit} value={unit}>
															{unit}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<CategoryInput
										control={form.control}
										name="category"
										label="Category"
										options={categoryOptions}
										placeholder="Select category"
										onChange={(value) => {
											handleCategoryChange(value);
											field.onChange(value);
										}}
									/>
								)}
							/>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="subCategory"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Sub Category</FormLabel>
											<Select
												value={selectedSubCategory}
												onValueChange={(value) => {
													handleSubCategoryChange(value);
													field.onChange(value);
												}}
												disabled={!selectedCategory}>
												<FormControl>
													<SelectTrigger className="relative ">
														<Input
															placeholder="Select subcategory"
															className={`${
																!field.value ? "absolute " : "hidden"
															} p-2 border-none bg-transparent z-10`}
														/>
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{availableSubCategories.map((subCategory) => (
														<SelectItem key={subCategory} value={subCategory}>
															{subCategory}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="subSubCategory"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Sub Sub-Category</FormLabel>
											<Select
												value={selectedSubSubCategory}
												onValueChange={(value) => {
													handleSubSubCategoryChange(value);
													field.onChange(value);
												}}
												disabled={!selectedSubCategory}>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="Select Sub Sub-Category" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													{availableSubSubCategories.map((subSubCategory) => (
														<SelectItem key={subSubCategory} value={subSubCategory}>
															{subSubCategory}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
						</div>
						<Separator />
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<TextInput
									control={form.control}
									name="tags"
									label="Tags"
									placeholder="Enter tags"
									type="text"
								/>
								<TextInput
									control={form.control}
									name="colors"
									label="Available Colors"
									placeholder="Enter colors"
									type="text"
								/>
							</div>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<SelectInput
									control={form.control}
									name="manufacturer"
									label="Manufacturer"
									options={manufacturerOptions}
									placeholder="Select Manufacturer..."
								/>
								<SelectInput
									control={form.control}
									name="brand"
									label="Brand"
									options={brandOptions}
									placeholder="Select Brand..."
								/>
							</div>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<TextInput
									control={form.control}
									name="countryOfManufacture"
									label="Country of Manufacture"
									placeholder="Enter country of manufacture"
									type="text"
								/>
								<TextInput
									control={form.control}
									name="sizesRun"
									label="Sizes Run"
									placeholder="Enter sizes run"
									type="text"
								/>
							</div>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<TextInput
									control={form.control}
									name="fabricType"
									label="Fabric Type"
									placeholder="Enter fabric type"
									type="text"
								/>
								<TextInput
									control={form.control}
									name="sizeType"
									label="Size Type"
									placeholder="Enter size type"
									type="text"
								/>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<TextInput
									control={form.control}
									name="unitPrice"
									label="Price per Unit"
									placeholder="Enter price..."
									type="number"
								/>
								<FormField
									control={form.control}
									name="weight"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Weight</FormLabel>

											{/* Wrapper to contain both input and select */}
											<FormControl className="">
												<div className="relative">
													<Input
														type="number"
														placeholder="Enter weight"
														// value={field.value.value}
														onChange={(e) =>
															field.onChange({
																...field.value,
																value: Number(e.target.value),
															})
														}
														className="w-full pr-16"
													/>

													{/* Dropdown for units (kg, g, lb, oz) */}
													<div className="absolute right-2 top-1/2 transform -translate-y-1/2">
														<Select
															onValueChange={(value) => {
																field.onChange({ ...field.value, unit: value });
															}}>
															<SelectTrigger className="border-none bg-slate-200">
																<SelectValue placeholder="Unit" />
															</SelectTrigger>
															<SelectContent>
																<SelectItem value="kg">kg</SelectItem>
																<SelectItem value="g">g</SelectItem>
																<SelectItem value="lb">lb</SelectItem>
																<SelectItem value="oz">oz</SelectItem>
															</SelectContent>
														</Select>
													</div>
												</div>
											</FormControl>

											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<TextInput
									control={form.control}
									name="isbn"
									label="ISBN"
									placeholder="Enter ISBN"
									type="number"
									tooltipContent="Thirteen digit unique commercial book identifier (International Standard Book Number)"
								/>
								<TextInput
									control={form.control}
									name="upc"
									label="UPC"
									placeholder="Enter UPC"
									type="number"
									tooltipContent="Twelve digit unique number associated with the bar code(Universal Product Code)"
								/>
							</div>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
								<TextInput
									control={form.control}
									name="mpn"
									label="MPN"
									placeholder="Enter MPN"
									type="number"
									tooltipContent="	Manufacturing Part Number unambiguously identifies a part	design"
								/>
								<TextInput
									control={form.control}
									name="ean"
									label="EAN"
									placeholder="Enter EAN"
									type="number"
									tooltipContent="	Thirteen digit unique number (International Article Number)"
								/>
								<TextInput
									control={form.control}
									name="fob"
									label="FOB"
									placeholder="Enter FOB"
									type="number"
									tooltipContent="Free on Board"
								/>
							</div>
						</div>

						<Separator />
						<h1 className="text-2xl font-bold">Sales Information</h1>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
							<TextInput
								control={form.control}
								name="sellingPrice"
								label="Selling Price *"
								placeholder="Enter selling price"
								type="number"
								required={true}
								tooltipContent="The rate at which you're going to sell this item"
							/>
							<TextInput
								control={form.control}
								name="account"
								label="Account *"
								placeholder="Enter account"
								type="text"
								required={true}
								disabled={true}
								tooltipContent="All sales transactions for this item will be tracked under this account"
							/>
							<TextInput
								control={form.control}
								name="salesTaxRule"
								label="Sales Tax Rule "
								placeholder="Select sales tax rule"
								type="text"
								tooltipContent="The tax rates will be automatically applied to transactions based on your default sales tax rule. If you want to apply a different tax rate for this item, select a sales tax rule."
							/>
						</div>
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter product description"
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button disabled={loading} type="submit">
							{loading ? "Adding Product..." : "Add Product"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
