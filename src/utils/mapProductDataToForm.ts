import { z } from "zod";
import { formSchema } from "@/app/vendor/dashboard/product/_components/product-form";
import {
	categoryOptions,
	subCategoryOptions,
	subSubCategoryOptions,
} from "@/constants/categoryData";

type FormValues = z.infer<typeof formSchema> & {
	images?: string[];
	initialStock?: number;
	availableStock?: number;
};

export const mapProductDataToForm = (product: any): FormValues => {
	// Map the product data to the form data structure
	const customFields = product?.custom_fields || [];

	// Find specific custom fields if needed
	const tagsField = customFields.find((field: any) => field.api_name === "cf_tags");
	const fobField = customFields.find((field: any) => field.api_name === "cf_fob");
	const fabricTypeField = customFields.find((field: any) => field.api_name === "cf_fabric_type");
	const colorField = customFields.find((field: any) => field.api_name === "cf_color");
	const unitPerBoxField = customFields.find((field: any) => field.api_name === "cf_packs");
	const unitPriceField = customFields.find((field: any) => field.api_name === "cf_item_price");
	const incotermsField = customFields.find((field: any) => field.api_name === "cf_incoterms");
	const sizeRunField = customFields.find((field: any) => field.api_name === "cf_sizes_run");
	const sizeTypeField = customFields.find((field: any) => field.api_name === "cf_size_type");
	const productCodeField = customFields.find(
		(field: any) => field.api_name === "cf_product_code_vendor",
	);
	const countryOfManufactureField = customFields.find(
		(field: any) => field.customfield_id === "4650667000013664890",
	);
	const imagesField = customFields.find((field: any) => field.api_name === "cf_productimages");

	// const { category, subCategory, subSubCategory } = determineCategoryHierarchy(product?.category);

	const { category, subCategory, subSubCategory } = findCategoryHierarchy(product?.category_id);
	console.log("solution", category, subCategory, subSubCategory);

	return {
		name: product?.name || "",
		sku: product?.sku || "",
		productCode: productCodeField?.value || "",
		vendorId: product?.vendor_id || "",
		unit: product?.unit || "",
		category: category || "",
		subCategory: subCategory || "",
		subSubCategory: subSubCategory || "",
		sellingPrice: product?.rate?.toString() || "",
		account: product?.account_name || "Sales",
		salesTaxRule: product?.sales_tax_rule || "",
		description: product?.description || "",
		unitPrice: unitPriceField?.value || "",
		availableColors: colorField?.value || "",
		unitPerBox: unitPerBoxField?.value || "",
		fabricType: fabricTypeField?.value || "",
		sizesRun: sizeRunField?.value || "",
		sizeType: sizeTypeField?.value || "",
		incoterms: incotermsField?.value || "",
		countryOfManufacture: countryOfManufactureField?.value || "",
		fob: fobField?.value || "",
		tags: tagsField?.value || "",
		weight_unit: product?.package_details?.weight_unit || "",
		weight: product?.package_details?.weight || "",
		image: imagesField?.value ? JSON.parse(imagesField.value) : [],
		// image: imagesField?.value ? JSON.parse(imagesField.value).map((img: any) => img.url) : [],
		brand: product?.brand || "",
		manufacturer: product?.manufacturer || "",
		upc: product?.upc || "",
		ean: product?.ean || "",
		isbn: product?.isbn || "",
		mpn: product?.part_number || "",
		availableStock: product?.available_for_sale_stock || "",
		openingStock: product?.initial_stock || "",
	};
};

const findCategoryHierarchy = (categoryId: string) => {
	let result = {
		category: "",
		subCategory: "",
		subSubCategory: "",
	};

	const matchedCategory = categoryOptions.find((cat) => cat.id === categoryId);
	if (matchedCategory) {
		result.category = matchedCategory.value;
		return result;
	}

	// 2. Check if categoryId matches any subcategory
	for (const mainCategory of categoryOptions) {
		const matchedSubCategory = mainCategory.subCategories?.find(
			(subCat) => subCat.id === categoryId,
		);
		if (matchedSubCategory) {
			result.category = mainCategory.value;
			result.subCategory = matchedSubCategory.value;
			return result;
		}
	}

	// 3. Check if categoryId matches any sub-subcategory
	for (const mainCategory of categoryOptions) {
		for (const subCategory of mainCategory.subCategories || []) {
			const matchedSubSubCategory = subSubCategoryOptions[subCategory.value]?.find(
				(subSubCat: any) => subSubCat.id === categoryId,
			);
			if (matchedSubSubCategory) {
				result.category = mainCategory.value;
				result.subCategory = subCategory.value;
				result.subSubCategory = matchedSubSubCategory.value;
				// console.log("RESULT111", result);
				return result;
			}
		}
	}

	// console.log("RESULTMAPP", result);
	return result;
};
