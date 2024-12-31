"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/constants/mock-api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { fobOptions, incotermsOptions } from "@/constants/optionsData";
import { toast } from "sonner";
import { useVendorStore } from "@/stores/useVendorStore";
import { useRouter } from "next/navigation";
import { formatProductData } from "@/utils/formatProductData";
import { subCategoryOptions, subSubCategoryOptions } from "@/constants/categoryData";
import { createProduct, editProduct } from "@/lib/product-utils";
import Loader from "@/components/loader";
import VendorInformation from "./form/vendor-information";
import SalesInformation from "./form/sales-information";
import ProductBasicInfo from "./form/product-basic-info";
import { ProductCategorySection } from "./form/category-section";
import {
	ProductCodes,
	ProductDescription,
	ProductIdentifiers,
	ProductManufacturingInfo,
	ProductSizeAndColor,
} from "./form/product-identifier";

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
	openingStockUnit: z.any().optional(),
	sampleAvailable: z.any().optional(),

	productCode: z.string().optional(),
	status: z.string().optional(),
	// productCode: z.string().min(1, {
	// 	message: "Your Product code is compulsory",
	// }),
});

export default function ProductForm({
	initialData,
	pageTitle,
	productId,
	isDuplicating = false,
}: {
	initialData: Product | any;
	pageTitle: string;
	productId: any;
	isDuplicating?: boolean;
}) {
	const vendorId = useVendorStore((state) => state.vendorId);
	if (!vendorId) {
		const vendorId = localStorage.getItem("vendorId");
		// console.log("VENDOR ID from local storage", vendorId);
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
		salesTaxRule: initialData?.salesTaxRule || "Tax Rule for Standard Rate",
		description: initialData?.description || "",
		unitPrice: initialData?.unitPrice || "",
		availableColors: initialData?.availableColors || "",
		sizesRun: initialData?.sizesRun || "",
		countryOfManufacture: initialData?.countryOfManufacture || "",
		fabricType: initialData?.fabricType || "",
		sizeType: initialData?.sizeType || "",
		unitPerBox: initialData?.unitPerBox || "",
		incoterms: initialData?.incoterms || "",
		openingStockUnit: initialData?.openingStockUnit || "",
		tags: initialData?.tags || "",
		weight_unit: initialData?.weight_unit || "kg",
		weight: initialData?.weight || "",
		upc: initialData?.upc || "",
		mpn: initialData?.mpn || "",
		ean: initialData?.ean || "",
		status: initialData?.status || "",
		isbn: initialData?.isbn || "",
		fob: initialData?.fob || "",
		sampleAvailable: initialData?.sampleAvailable || "Yes",
		manufacturer: initialData?.manufacturer || "",
		brand: initialData?.brand || "",
		openingStock: isDuplicating ? "0" : "",
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
	const { control, setValue, setError, clearErrors, watch } = form;

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

		let generatedSku = "";

		if (productId === "new") {
			// Increment the product count for new products
			generatedSku = brandName
				? `B-${vendorPrefix}${String(productCount + 1).padStart(5, "0")}-${brandPrefix}`
				: `B-${vendorPrefix}${String(productCount + 1).padStart(5, "0")}`;
		} else {
			// Use the current SKU without incrementing the product count
			generatedSku = initialData?.sku;
		}

		setSku(generatedSku);
		setValue("sku", generatedSku);
	}, [brandName, productCount, vendorName, setValue, productId]);

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
	// console.log("NEW SKU", sku);

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

		// console.log("Formatted Product Data", formatProductData(values));

		try {
			if (productId === "new" || isDuplicating) {
				const productData: any = await createProduct(values, images);
				// console.log("Product created successfully", productData);
				toast.success(`Product Name: ${productData.item.name} created successfully`);
				router.push(`/vendor/dashboard/product`);
				setIsLoading(false);
			} else {
				// toast.success(`Product Name: ${values.name} updated successfully`);

				// console.log("Product", productId);
				const productData: any = await editProduct(productId, values, images);
				toast.success(`Product ${productData.item.name} updated successfully`);
				// router.refresh();
				router.replace(`/vendor/dashboard/product/view/${productId}`);
				setIsLoading(false);
			}
		} catch (error: any) {
			if (error.response) {
				const errorMessage = error.response.data?.message || "An error occurred.";
				// console.error("Server Error:", errorMessage);
				toast.error(errorMessage);
				setIsLoading(false);
			} else {
				const errorMessage = error?.message || "An error occurred.";
				// console.error("Error in API call:", errorMessage);
				toast.error(errorMessage);
				setIsLoading(false);
			}
		}
	}

	const categoryProps = {
		selectedCategory,
		selectedSubCategory,
		selectedSubSubCategory,
		handleCategoryChange,
		handleSubCategoryChange,
		handleSubSubCategoryChange,
		availableSubCategories,
		availableSubSubCategories,
	};

	return (
		<Card className="mx-auto w-full">
			<CardHeader>
				<CardTitle className="text-left text-2xl font-bold">{pageTitle}</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<Loader
						message={`${productId === "new" ? "Adding" : "Editing"} product Please wait...`}
						fullscreen={false}
					/>
				) : (
					<Form {...form}>
						<h1 className="text-2xl font-bold">Product Information</h1>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<ProductBasicInfo
								productId={productId}
								form={form}
								images={images}
								setImages={setImages}
								isLoading={isLoading}
								initialData={initialData}
							/>

							<ProductIdentifiers form={form} />

							<ProductSizeAndColor form={form} />

							<ProductCategorySection form={form} productId={productId} {...categoryProps} />

							<ProductManufacturingInfo form={form} handleBrandChange={handleBrandChange} />

							<ProductCodes form={form} />

							<ProductDescription form={form} />

							<Separator />

							<VendorInformation
								control={form.control}
								fobOptions={fobOptions}
								incotermsOptions={incotermsOptions}
							/>

							<Separator />

							<SalesInformation
								control={form.control}
								productId={productId}
								setValue={setValue}
								setError={setError}
								clearErrors={clearErrors}
							/>

							<SubmitButton isLoading={isLoading} productId={productId} />
						</form>
					</Form>
				)}
			</CardContent>
		</Card>
	);
}

// Submit Button Component
const SubmitButton = ({ isLoading, productId }: any) => (
	<Button disabled={isLoading} type="submit">
		{isLoading ? "Adding product..." : productId === "new" ? "Add Product" : "Update Product"}
	</Button>
);

export { SubmitButton };
