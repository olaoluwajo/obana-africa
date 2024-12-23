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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
	brandOptions,
	fabricTypeOptions,
	fobOptions,
	incotermsOptions,
	manufacturerOptions,
	unitOptions,
	unitPerBoxOptions,
} from "@/constants/optionsData";
import TextInput from "./inputs/text-input";
import SelectInput from "./inputs/select-input";
import CategoryInput from "./inputs/category-input";
import { toast } from "sonner";
import { useVendorStore } from "@/stores/useVendorStore";
import { useRouter } from "next/navigation";
import { formatProductData } from "@/utils/formatProductData";
import {
	categoryOptions,
	subCategoryOptions,
	subSubCategoryOptions,
} from "@/constants/categoryData";
import { createProduct, editProduct } from "@/lib/product-utils";
import Loader from "@/components/loader";

export const formSchema = z.object({
	image: z.any().nullable(),
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
	brand: z.string().min(1, {
		message: "Brand is required to create product.",
	}),
	availableColors: z.string().optional(),
	tags: z.string().optional(),
	sizesRun: z.string().optional(),
	countryOfManufacture: z.string().optional(),
	fabricType: z.string().optional(),
	sizeType: z.string().optional(),
	weight: z.any().optional(),
	weight_unit: z.any().optional(),
	upc: z.any().optional(),
	mpn: z.any().optional(),
	ean: z.any().optional(),
	isbn: z.any().optional(),
	incoterms: z.any().optional(),
	fob: z.any().optional(),
	vendorId: z.string(),
	unitPerBox: z.any().optional(),
	openingStock: z.any().optional(),
	availableStock: z.any().optional(),
	productCode: z.string().min(1, {
		message: "Your Product code is compulsory",
	}),
});

export default function ProductForm({
	initialData,
	pageTitle,
	productId,
	isDuplicating = false,
}: {
	initialData: Product | any;
	pageTitle: string;
	productId: string;
	isDuplicating?: boolean;
}) {
	const vendorId = useVendorStore((state) => state.vendorId);
	if (!vendorId) {
		const vendorId = localStorage.getItem("vendorId");
		console.log("VENDOR ID from local storage", vendorId);
		if (vendorId) {
			useVendorStore.getState().setVendorId(vendorId);
		}
	}

	const defaultValues = {
		...initialData,
		sku: isDuplicating ? "" : initialData?.sku || "",
		productCode: isDuplicating ? "" : initialData?.productCode || "",
		name: isDuplicating ? `Copy of ${initialData?.name}` : initialData?.name || "",
		image: initialData?.image || "",
		vendorId: vendorId || "",
		unit: initialData?.unit || "Box",
		category: initialData?.category || "",
		subCategory: initialData?.subCategory || "",
		subSubCategory: initialData?.subSubCategory || "",
		sellingPrice: initialData?.sellingPrice || "",
		account: initialData?.account || "Sales",
		salesTaxRule: initialData?.salesTaxRule || "",
		description: initialData?.description || "",
		unitPrice: initialData?.unitPrice || "",
		availableColors: initialData?.availableColors || "",
		sizesRun: initialData?.sizesRun || "",
		countryOfManufacture: initialData?.countryOfManufacture || "",
		fabricType: initialData?.fabricType || "",
		sizeType: initialData?.sizeType || "",
		unitPerBox: initialData?.unitPerBox || "",
		incoterms: initialData?.incoterms || "",
		tags: initialData?.tags || "",
		weight_unit: initialData?.weight_unit || "kg",
		weight: initialData?.weight || "",
		upc: initialData?.upc || "",
		mpn: initialData?.mpn || "",
		ean: initialData?.ean || "",
		isbn: initialData?.isbn || "",
		fob: initialData?.fob || "",
		manufacturer: initialData?.manufacturer || "",
		brand: initialData?.brand || "",
		openingStock: isDuplicating ? "0" : initialData?.openingStock || "",
		availableStock: isDuplicating ? "0" : initialData?.availableStock || "",
	};

	const router = useRouter();

	// State for dynamic category, subcategory, and sub-subcategory options
	const [selectedCategory, setSelectedCategory] = useState(defaultValues.category || "");
	const [selectedSubCategory, setSelectedSubCategory] = useState(defaultValues.subCategory || "");
	const [selectedSubSubCategory, setSelectedSubSubCategory] = useState(
		defaultValues.subSubCategory || "",
	);
	const [availableSubCategories, setAvailableSubCategories] = useState<string[]>([]);
	const [availableSubSubCategories, setAvailableSubSubCategories] = useState<string[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [images, setImages] = useState<File[]>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: defaultValues,
	});
	const { watch, setValue } = form;

	// Sample vendor and brand data
	const [sku, setSku] = useState<string>(initialData?.sku || "");
	const [vendorName, setVendorName] = useState<string>("");
	const [brandName, setBrandName] = useState<string>(initialData?.brand || "");
	const [productCount, setProductCount] = useState<number>(0);

	useEffect(() => {
		const storedVendorName = localStorage.getItem("vendorName");
		const storedProductCount = localStorage.getItem("productCount");
		if (storedVendorName && storedProductCount) {
			setVendorName(storedVendorName);
			setProductCount(Number(storedProductCount));
		}
		// console.log("Vendor form newname", storedVendorName);
		// console.log("Product count", storedProductCount);
	}, []);

	useEffect(() => {
		const vendorPrefix = vendorName ? vendorName.slice(0, 3).toUpperCase() : "";
		const brandPrefix = brandName ? brandName.slice(0, 3).toUpperCase() : "";
		// Generate SKU
		const generatedSku = brandName
			? `B-${vendorPrefix}${String(productCount + 1).padStart(5, "0")}-${brandPrefix}`
			: `B-${vendorPrefix}${String(productCount + 1).padStart(5, "0")}`;

		setSku(generatedSku);
		setValue("sku", generatedSku);
		// console.log("Genrated sku", generatedSku);
	}, [brandName, productCount, vendorName, setValue]);

	// SELLING PRICE CALCULATION
	const unitPerBox = watch("unitPerBox");
	const unitPrice = watch("unitPrice");
	useEffect(() => {
		if (unitPerBox && unitPrice) {
			const calculatedSellingPrice = Number(unitPerBox) * Number(unitPrice);
			setValue("sellingPrice", calculatedSellingPrice.toFixed(2));
		}
	}, [unitPerBox, unitPrice, setValue]);

	const [weight, setWeight] = useState<number | null>(null);

	useEffect(() => {
		// Get the weight based on selected sub-subcategory
		const selectedSubSubCategoryOption = subSubCategoryOptions[selectedSubCategory]?.find(
			(option) => option.value === selectedSubSubCategory,
		);

		if (selectedSubSubCategoryOption) {
			setWeight(selectedSubSubCategoryOption.weight);
			setValue("weight", selectedSubSubCategoryOption.weight);
		}
	}, [selectedSubCategory, selectedSubSubCategory, setValue]);

	// WEIGHT CALCULATION (this is new)
	useEffect(() => {
		// If unitPerBox and weight are available, calculate total weight
		if (unitPerBox && weight) {
			const calculatedWeight = Number(unitPerBox) * weight;
			setValue("weight", calculatedWeight);
		}
	}, [unitPerBox, weight, setValue]);

	const handleBrandChange = (brand: string) => {
		setBrandName(brand);
	};
	console.log("NEW SKU", sku);

	// Handle category selection change
	const handleCategoryChange = (category: any) => {
		setSelectedCategory(category);
		setAvailableSubCategories(
			(subCategoryOptions[category as keyof typeof subCategoryOptions] || []).map(
				(item) => item.value,
			),
		);
		setSelectedSubCategory("");
		setAvailableSubSubCategories([]);
	};

	// Handle subcategory selection change
	const handleSubCategoryChange = (subCategory: any) => {
		setSelectedSubCategory(subCategory);
		setAvailableSubSubCategories(
			(subSubCategoryOptions[subCategory as keyof typeof subSubCategoryOptions] || []).map(
				(item) => item.value,
			),
		);
	};

	// Handle sub-subcategory selection change
	const handleSubSubCategoryChange = (subSubCategory: any) => {
		setSelectedSubSubCategory(subSubCategory);
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({ name: values.name }), 4000));

		// console.log(values);
		setIsLoading(true);
		if (productId === "new") {
			toast.promise(promise, {
				// loading: "Adding Product, Please wait...",
				loading: `Adding Product ${values.name}, Please wait...`,
				// success: (data: any) => {
				// 	return `Product ${data.name}  created successfully`;
				// },
				error: "Error",
			});
		} else {
			toast.promise(promise, {
				loading: `Updating Product ${values.name}, Please wait...`,
				error: "Error",
			});
		}

		console.log("Formatted Product Data", formatProductData(values));

		try {
		  if (productId === "new" || isDuplicating) {
				const productData: any = await createProduct(values, images);
				console.log("Product created successfully", productData);
				toast.success(`Product Name: ${productData.item.name} created successfully`);
				router.push(`/vendor/dashboard/product`);
				setIsLoading(false);
			} else {
				// toast.success(`Product Name: ${values.name} updated successfully`);

				console.log("Product", productId);
				const productData: any = await editProduct(productId, values, images);
				toast.success(`Product ${productData.item.name} updated successfully`);
				router.refresh();
				router.push(`/vendor/dashboard/product/view/${productId}`);
				setIsLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				console.error(error.response);
				console.error(error.response.data.message);
				toast.error(error.response.data.message);
				setIsLoading(false);
			} else {
				console.error("Error in API call:", error.message);
				console.error("Error in API call:", error.data);
				toast.error("Error in API call:", error.data);
				setIsLoading(false);
			}
		}
	}

	React.useEffect(() => {
		if (productId !== "new" && initialData?.image) {
			// Function to fetch and convert URL to File
			const urlToFile = async (url: string, index: number) => {
				try {
					const response = await fetch(url);
					const blob = await response.blob();
					const fileName = `Product-image-${index + 1}.jpg`;
					const file = new File([blob], fileName, { type: blob.type });
					Object.assign(file, { preview: url });
					return file;
				} catch (error) {
					console.error(`Error converting URL to file: ${error}`);
					return null;
				}
			};

			// Convert all URLs to Files
			const loadImages = async () => {
				const imageUrls = Array.isArray(initialData.image)
					? initialData.image
					: [initialData.image];

				const filePromises = imageUrls.map((url: any, index: any) => urlToFile(url, index));
				const files = await Promise.all(filePromises);
				const validFiles = files.filter((file): file is File => file !== null);
				setImages(validFiles);
			};

			loadImages();

			// Cleanup
			return () => {
				images.forEach((file: any) => {
					if (file.preview) {
						URL.revokeObjectURL(file.preview);
					}
				});
			};
		}
	}, [productId, initialData?.image]);

	return (
		<Card className="mx-auto w-full">
			<CardHeader>
				<CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					productId === "new" ? (
						<Loader message="Adding product Please wait..." />
					) : (
						<Loader message="Editing product Please wait..." />
					)
				) : (
					<Form {...form}>
						<h1 className="text-2xl font-bold">Product Information</h1>
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
													value={images}
													onValueChange={(files) => setImages(files)}
													maxFiles={8}
													maxSize={4 * 1024 * 1024}
													disabled={isLoading}
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

								<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
									<TextInput
										control={form.control}
										name="productCode"
										label="Product Code *"
										placeholder="Enter your Product code"
										type="text"
										required={true}
									/>
									<TextInput
										control={form.control}
										name="sku"
										label="SKU *"
										placeholder="Generated SKU"
										type="text"
										value={form.watch("sku")}
										required={true}
										disabled={true}
										tooltipContent="The Stock Keeping Unit of the item"
									/>

									<SelectInput
										control={form.control}
										name="unit"
										label="Unit of Measurement"
										options={unitOptions}
										placeholder="Select Unit..."
									/>
								</div>

								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<div className="grid grid-cols-2 gap-6 md:grid-cols-2">
										<SelectInput
											control={form.control}
											name="unitPerBox"
											label="Unit Per Box"
											options={unitPerBoxOptions}
											placeholder="Enter Unit Per Box"
										/>
										<TextInput
											control={form.control}
											name="unitPrice"
											label="Price per Unit"
											placeholder="Enter price..."
											type="number"
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
								</div>
								{productId === "new" ? (
									<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
										{selectedCategory && (
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
																	<SelectValue placeholder="Select Sub Sub-Category" />
																</SelectTrigger>
															</FormControl>
															<SelectContent>
																{availableSubCategories.map((subCategory) => (
																	<SelectItem
																		key={subCategory}
																		value={subCategory}>
																		{subCategory}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}
										{selectedSubCategory && (
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
																	<SelectItem
																		key={subSubCategory}
																		value={subSubCategory}>
																		{subSubCategory}
																	</SelectItem>
																))}
															</SelectContent>
														</Select>
														<FormMessage />
													</FormItem>
												)}
											/>
										)}

										<div className="grid grid-cols-1 gap-6 md:grid-cols-1">
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
																	value={field.value || ""}
																	// onChange={(e) =>
																	// 	field.onChange({
																	// 		...field.value,
																	// 		value: Number(e.target.value),
																	// 	})
																	// }
																	onChange={(e) => field.onChange(e.target.value)}
																	className="w-full pr-16"
																/>

																{/* Dropdown for units (kg, g, lb, oz) */}
																<div className="absolute right-0 top-1/2 transform -translate-y-1/2">
																	<FormField
																		control={form.control}
																		name="weight_unit"
																		render={({ field: unitField }) => (
																			<Select
																				value={unitField.value}
																				onValueChange={unitField.onChange}>
																				<SelectTrigger className="border-none bg-slate-200">
																					<SelectValue placeholder="Unit" />
																				</SelectTrigger>
																				<SelectContent>
																					<SelectItem value="kg">
																						kg
																					</SelectItem>
																					<SelectItem value="g">g</SelectItem>
																					<SelectItem value="lb">
																						lb
																					</SelectItem>
																					<SelectItem value="oz">
																						oz
																					</SelectItem>
																				</SelectContent>
																			</Select>
																		)}
																	/>
																</div>
															</div>
														</FormControl>

														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								) : (
									<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
														}}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select Sub Sub-Category" />
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
														}}>
														<FormControl>
															<SelectTrigger>
																<SelectValue placeholder="Select Sub Sub-Category" />
															</SelectTrigger>
														</FormControl>
														<SelectContent>
															{availableSubSubCategories.map((subSubCategory) => (
																<SelectItem
																	key={subSubCategory}
																	value={subSubCategory}>
																	{subSubCategory}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FormMessage />
												</FormItem>
											)}
										/>

										<div className="grid grid-cols-1 gap-6 md:grid-cols-1">
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
																	value={field.value || ""}
																	// onChange={(e) =>
																	// 	field.onChange({
																	// 		...field.value,
																	// 		value: Number(e.target.value),
																	// 	})
																	// }
																	onChange={(e) => field.onChange(e.target.value)}
																	className="w-full pr-16"
																/>

																{/* Dropdown for units (kg, g, lb, oz) */}
																<div className="absolute right-0 top-1/2 transform -translate-y-1/2">
																	<FormField
																		control={form.control}
																		name="weight_unit"
																		render={({ field: unitField }) => (
																			<Select
																				value={unitField.value}
																				onValueChange={unitField.onChange}>
																				<SelectTrigger className="border-none bg-slate-200">
																					<SelectValue placeholder="Unit" />
																				</SelectTrigger>
																				<SelectContent>
																					<SelectItem value="kg">
																						kg
																					</SelectItem>
																					<SelectItem value="g">g</SelectItem>
																					<SelectItem value="lb">
																						lb
																					</SelectItem>
																					<SelectItem value="oz">
																						oz
																					</SelectItem>
																				</SelectContent>
																			</Select>
																		)}
																	/>
																</div>
															</div>
														</FormControl>

														<FormMessage />
													</FormItem>
												)}
											/>
										</div>
									</div>
								)}
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
							<Separator />
							<h1 className="text-2xl font-bold">Vendor Information</h1>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<TextInput
										control={form.control}
										name="tags"
										label="Tags"
										placeholder="Enter tags"
										type="text"
										tooltipContent="Type your product tag and add a comma to add a new tag."
									/>
									<TextInput
										control={form.control}
										name="availableColors"
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
										onChange={handleBrandChange}
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
									<SelectInput
										control={form.control}
										name="fabricType"
										label="Fabric Type"
										options={fabricTypeOptions}
										placeholder="Select fabric type"
									/>
									{/* <TextInput
									control={form.control}
									name="fabricType"
									label="Fabric Type"
									placeholder="Enter fabric type"
									type="text"
								/> */}
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

									<SelectInput
										control={form.control}
										name="fob"
										label="FOB"
										options={fobOptions}
										placeholder="Enter FOB"
									/>
								</div>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
									<SelectInput
										control={form.control}
										name="incoterms"
										label="INCOTERMS"
										options={incotermsOptions}
										placeholder="Select incoterm..."
									/>
									{/* <TextInput
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
								/> */}
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
									disabled={true}
									tooltipContent="The rate at which you're going to sell this item exclusive of tax"
								/>{" "}
								<TextInput
									control={form.control}
									name="salesTaxRule"
									label="Sales Tax Rule "
									placeholder="Select sales tax rule"
									type="text"
									tooltipContent="The tax rates will be automatically applied to transactions based on your default sales tax rule. If you want to apply a different tax rate for this item, select a sales tax rule."
								/>
								<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
									<TextInput
										control={form.control}
										name="openingStock"
										label="Opening Stock *"
										placeholder="Enter opening stock"
										type="number"
										required={true}
										tooltipContent="The number of initial stock of items available"
									/>
									<TextInput
										control={form.control}
										name="availableStock"
										label="Available to Sell"
										placeholder="Enter available stock"
										type="number"
										tooltipContent="The number of available stock of this product"
									/>
								</div>
							</div>

							<Button disabled={isLoading} type="submit">
								{isLoading
									? "Adding product..."
									: productId === "new"
									? "Add Product"
									: "Update Product"}
							</Button>
						</form>
					</Form>
				)}
			</CardContent>
		</Card>
	);
}
