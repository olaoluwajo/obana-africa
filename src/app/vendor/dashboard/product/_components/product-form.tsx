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
import { brandOptions, manufacturerOptions, unitOptions } from "@/constants/optionsData";
import TextInput from "./inputs/text-input";
import SelectInput from "./inputs/select-input";
import CategoryInput from "./inputs/category-input";
import axios from "axios";
import { toast } from "sonner";
import { useVendorStore } from "@/stores/useVendorStore";
import { useRouter } from "next/navigation";
import { formatProductData } from "@/utils/formatProductData";
import {
	categoryOptions,
	subCategoryOptions,
	subSubCategoryOptions,
} from "@/constants/categoryData";
import { createProduct } from "@/lib/create-product-utils";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const formSchema = z.object({
	image: z
		.any()
		.nullable(),
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
	fob: z.any().optional(),
	vendorId: z.string(),
	unitPerBox: z.any().optional(),
});

export default function ProductForm({
	initialData,
	pageTitle,
	productId,
}: {
	initialData: Product | any;
	pageTitle: string;
	productId: string;
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
		image: initialData?.image || "",
		name: initialData?.name || "",
		sku: initialData?.sku || "",
		vendorId: vendorId || "",
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
		sizesRun: initialData?.sizesRun || "",
		countryOfManufacture: initialData?.countryOfManufacture || "",
		fabricType: initialData?.fabricType || "",
		sizeType: initialData?.sizeType || "",
		unitPerBox: initialData?.unitPerBox || "",

		tags: initialData?.tags || "",
		// weight: {
		// 	value: initialData?.weight || "",
		// 	unit: "kg",
		// },
		weight_unit: initialData?.weight_unit || "",
		weight: initialData?.weight || "",
		upc: initialData?.upc || "",
		mpn: initialData?.mpn || "",
		ean: initialData?.ean || "",
		isbn: initialData?.isbn || "",
		fob: initialData?.fob || "",
		manufacturer: initialData?.manufacturer || "",
		brand: initialData?.brand || "",
	};

	const router = useRouter();

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
	const [isLoading, setIsLoading] = useState(false);
	const [images, setImages] = useState<File[]>([]);
	const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		values: defaultValues,
	});

	const fabricTypeOptions = ["Cotton", "Polyester", "Wool", "Silk", "Linen"];
	// const sizeTypeOptions = ["Small", "Medium", "Large", "X-Large", "XX-Large"];
	const unitPerBoxOptions = ["5", "6", "7", "8", "9", "10", "12", "15", "20", "25", "30", "50"];

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

	const uploadImages = async (images: File[]): Promise<string[]> => {
		const urls: string[] = [];
		// console.log("IMAGES", images);

		for (const image of images) {
			const formData = new FormData();
			formData.append("image", image);
			// console.log("Image:", image);

			try {
				const response = await axios.post("/api/uploadImage", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});
				// console.log("RESPONSE", response);

				if (response.status === 200) {
					urls.push(response.data.url);
					console.log("Image uploaded successfully:", response.data.url);
				} else {
					console.error("Image upload failed:", response.data.error);
					toast.error("Image upload failed");
				}
			} catch (error: any) {
				console.error("Error uploading image:", error.message);
				toast.error("Error uploading image");
			}
		}

		return urls;
	};

	async function onSubmit(values: z.infer<typeof formSchema>) {
		const promise = () =>
			new Promise((resolve) => setTimeout(() => resolve({ name: values.name }), 3000));

		// console.log(values);
		setIsLoading(true);
		toast.promise(promise, {
			// loading: "Adding Product, Please wait...",
			loading: `Adding Product ${values.name}, Please wait...`,
			// success: (data: any) => {
			// 	return `Product ${data.name}  created successfully`;
			// },
			error: "Error",
		});

		console.log("Formatted Product Data", formatProductData(values));

		try {
			// if (images.length > 0) {
			// 	const uploadedUrls = await uploadImages(images);
			// 	setUploadedUrls(uploadedUrls);
			// 	console.log("UPLOADED URLS", uploadedUrls);
			// }

			// const formattedProductData = formatProductData({
			// 	...values,
			// 	images: uploadedUrls,
			// });
			// console.log("Formatted Product Data with images", formattedProductData);

			// const response = await axios.post("/api/create-product", {
			// 	vendorId: values.vendorId,
			// 	productData: formattedProductData,
			// });
			if (productId === "new") {
				const productData: any = await createProduct(values, images);
				console.log("Product created successfully", productData.data);
				toast.success(`Product Name: ${productData.item.name} created successfully`);
				router.push("/vendor/dashboard/[productId]/view");
				setIsLoading(false);
			} else {
				// await editProduct(productId);
				console.log("Product", productId);
			}
		} catch (error: any) {
			if (error.response) {
				console.error(error.response);
				console.error(error.response.data.message);
				toast.error(error.response.data.message);
				setIsLoading(false);
			} else {
				console.error("Error in API call:", error.message);
				toast.error("Error in API call:", error.message);
				setIsLoading(false);
			}
		}
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
												value={images}
												onValueChange={(files) => setImages(files)}
												maxFiles={8}
												maxSize={4 * 1024 * 1024}
												disabled={isLoading}
												// progresses={onprogress}
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

								<SelectInput
									control={form.control}
									name="unit"
									label="Unit"
									options={unitOptions}
									placeholder="Select Unit..."
								/>
							</div>

							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
							</div>
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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

								<SelectInput
									control={form.control}
									name="unitPerBox"
									label="Unit Per Box"
									options={unitPerBoxOptions}
									placeholder="Enter Unit Per Box"
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
													<div className="absolute right-2 top-1/2 transform -translate-y-1/2">
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
																		<SelectItem value="kg">kg</SelectItem>
																		<SelectItem value="g">g</SelectItem>
																		<SelectItem value="lb">lb</SelectItem>
																		<SelectItem value="oz">oz</SelectItem>
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
						<Button disabled={isLoading} type="submit">
							{isLoading
								? "Saving..."
								: productId === "new"
								? "Add Product"
								: "Update Product"}
						</Button>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
