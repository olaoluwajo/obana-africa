import { z } from "zod";
import { formSchema } from "@/app/vendor/dashboard/product/_components/product-form";
import {
	categoryOptions,
	subCategoryOptions,
	subSubCategoryOptions,
} from "@/constants/categoryData";

type FormValues = z.infer<typeof formSchema> & { images?: string[] };

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
	const sizeRunField = customFields.find((field: any) => field.api_name === "cf_sizes_run");
	const countryOfManufactureField = customFields.find(
		(field: any) => field.customfield_id === "4650667000013664890",
	);
	const imagesField = customFields.find((field: any) => field.api_name === "cf_productimages");

	const formattedCategory = formattedCategoryId({
		category: product?.category,
		subCategory: product?.subCategory,
		subSubCategory: product?.subSubCategory,
	});

	return {
		name: product?.name || "",
		sku: product?.sku || "",
		vendorId: product?.vendor_id || "",
		unit: product?.unit || "",
		category: product?.category || "",
		subCategory: product?.subCategory || "",
		subSubCategory: product?.subSubCategory || "",
		sellingPrice: product?.rate?.toString() || "",
		account: product?.account_name || "Sales",
		salesTaxRule: product?.sales_tax_rule || "",
		description: product?.description || "",
		unitPrice: unitPriceField?.unit_price || "",
		availableColors: colorField?.value || "",
		unitPerBox: unitPerBoxField?.value || "",
		fabricType: fabricTypeField?.value || "",
		sizesRun: sizeRunField?.value || "",
		countryOfManufacture: countryOfManufactureField?.value || "",
		fob: fobField?.value || "",
		tags: tagsField?.value || "",
		weight_unit: product?.package_details?.weight_unit || "",
		weight: product?.package_details?.weight || "",
		image: imagesField?.value ? JSON.parse(imagesField.value) : [],
		brand: product?.brand || "",
		manufacturer: product?.manufacturer || "",
		upc: product?.upc || "",
		ean: product?.ean || "",
		isbn: product?.isbn || "",
		mpn: product?.mpn || "",
	};
};

const formattedCategoryId = ({
	category,
	subCategory,
	subSubCategory,
}: {
	category: string;
	subCategory?: string;
	subSubCategory?: string;
}): string | null => {
	if (subSubCategory) {
		const subSubCategoryId =
			subSubCategoryOptions[subCategory as keyof typeof subSubCategoryOptions]?.find(
				(item: any) => item.value === subSubCategory,
			)?.id || null;
		if (subSubCategoryId) return subSubCategoryId;
	}

	if (subCategory) {
		const selectedCategory = categoryOptions.find((cat) => cat.value === category);
		if (selectedCategory) {
			const selectedSubCategory = selectedCategory.subCategories.find(
				(subCat) => subCat.value === subCategory,
			);
			if (selectedSubCategory) return selectedSubCategory.id;
		}
	}

	const selectedCategory = categoryOptions.find((cat) => cat.value === category);
	return selectedCategory?.id || null;
};
