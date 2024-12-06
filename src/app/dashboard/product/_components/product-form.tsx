"use client";

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
// Import Radix UI Tooltip
import * as Tooltip from "@radix-ui/react-tooltip";
import { ChevronDownIcon, MessageCircleQuestion } from "lucide-react";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
	image: z
		.any()
		.refine((files) => files?.length == 1, "Image is required.")
		.refine((files) => files?.[0]?.size <= MAX_FILE_SIZE, `Max file size is 5MB.`)
		.refine(
			(files) => ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
			".jpg, .jpeg, .png and .webp files are accepted.",
		),
	name: z.string().min(10, {
		message: "Product name must be at least 10 characters.",
	}),
	sku: z.string().min(5, {
		message: "SKU must be at least 5 characters.",
	}),
	unit: z.string().min(1, {
		message: "Unit is required.",
	}),
	category: z.string(),
	subCategory: z.string(),
	subSubCategory: z.string(),
	price: z.number(),
	description: z.string().min(5, {
		message: "Description must be at least 5 characters.",
	}),
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
		price: initialData?.price || 0,
		description: initialData?.description || "",
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

	// Mock data for categories, subcategories, and sub-subcategories
	const unitOptions = [
		"pcs",
		"kg",
		"litre",
		"metre",
		"box",
		"pack",
		"piece",
		"set",
		"pair",
		"cm",
		"dozen",
	];
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
		setSelectedSubCategory(""); // Reset subcategory when category changes
		setAvailableSubSubCategories([]); // Reset sub-subcategory
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
												maxFiles={4}
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
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-red-500">Product Name *</FormLabel>
										<FormControl>
											<Input placeholder="Enter product name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="sku"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-red-500">SKU *</FormLabel>
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
														className="bg-black/80 text-white px-2 py-1 rounded-md text-xs">
														The Stock Keeping Unit of the item
														<Tooltip.Arrow className="fill-black/80" />
													</Tooltip.Content>
												</Tooltip.Root>
											</FormControl>
											<Input type="text" placeholder="Enter SKU" {...field} />
											<FormMessage />
										</FormItem>
									)}
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
														className="bg-black/80 text-white px-2 py-1 rounded-md text-xs">
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
												<SelectTrigger>
													<SelectValue placeholder="Select Unit" />
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
								{/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price (NGN)</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="Enter price"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/> */}
							</div>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-red-500">Category *</FormLabel>
										<Select
											value={selectedCategory}
											onValueChange={(value) => {
												handleCategoryChange(value);
												field.onChange(value);
											}}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categoryOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
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
													<SelectTrigger>
														<SelectValue placeholder="Select subcategory" />
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
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-red-500">Product Name *</FormLabel>
										<FormControl>
											<Input placeholder="Enter product name" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="sku"
									render={({ field }) => (
										<FormItem>
											<FormLabel className="text-red-500">SKU *</FormLabel>
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
														className="bg-black/80 text-white px-2 py-1 rounded-md text-xs">
														The Stock Keeping Unit of the item
														<Tooltip.Arrow className="fill-black/80" />
													</Tooltip.Content>
												</Tooltip.Root>
											</FormControl>
											<Input type="text" placeholder="Enter SKU" {...field} />
											<FormMessage />
										</FormItem>
									)}
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
														className="bg-black/80 text-white px-2 py-1 rounded-md text-xs">
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
												<SelectTrigger>
													<SelectValue placeholder="Select Unit" />
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
								{/* <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<FormField
									control={form.control}
									name="price"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Price (NGN)</FormLabel>
											<FormControl>
												<Input
													type="number"
													step="0.01"
													placeholder="Enter price"
													{...field}
												/>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/> */}
							</div>
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-red-500">Category *</FormLabel>
										<Select
											value={selectedCategory}
											onValueChange={(value) => {
												handleCategoryChange(value);
												field.onChange(value);
											}}>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select category" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{categoryOptions.map((option) => (
													<SelectItem key={option.value} value={option.value}>
														{option.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
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
													<SelectTrigger>
														<SelectValue placeholder="Select subcategory" />
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
						<Button type="submit">Add Product</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
