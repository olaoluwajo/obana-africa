import { z } from "zod";
import { formSchema } from "@/app/vendor/dashboard/product/_components/product-form";
import {
	categoryOptions,
	subCategoryOptions,
	subSubCategoryOptions,
} from "@/constants/categoryData";

type FormValues = z.infer<typeof formSchema> & { images?: string[] };

export const formatProductData = (values: FormValues) => {
	const customFields = [
		{
			// index: 1,
			api_name: "cf_sku",
			value: "true",
		},
		{
			// index: 2,
			api_name: "cf_brand",
			value: "true",
		},
		{
			// index: 3,
			api_name: "cf_tags",
			value: values.tags,
		},
		{
			// index: 5,
			api_name: "cf_incoterms",
			value: "Incotermsfield Not done",
		},
		{
			// index: 6,
			api_name: "cf_fob",
			value: values.fob,
		},
		{
			// index: 7,
			api_name: "cf_sample_available",
			// value: "Yes",
			selected_option_id: "4650667000011592023",
		},
		{
			// index: 8,
			api_name: "cf_color",
			value: values.availableColors,
		},

		{
			// index: 11,
			api_name: "cf_fabric_type",
			value: values.fabricType,
		},
		{
			api_name: "cf_item_price",
			value: values.unitPrice,
		},
		{
			api_name: "cf_packs",
			value: values.unitPerBox,
		},
		{
			api_name: "cf_sizes_run",
			value: values.sizesRun,
		},
		{
			// api_name: "cf_country_of_manufacture",
			customfield_id: "4650667000013664890",
			value: values.countryOfManufacture,
		},

		{
			api_name: "cf_size_type",
			value: values.sizeType,
		},

		{
			api_name: "cf_productimages",
			value: values.images && values.images.length > 0 ? JSON.stringify(values.images) : "[]",
		},
		{
			api_name: "cf_singleimage",
			value:
				values.images && values.images.length > 0 ? JSON.stringify([values.images[0]]) : "[]",
		},
		{
			api_name: "cf_b2b",
			value: "YES",
		},
	];

	const formattedCategoryId = ({
		category,
		subCategory,
		subSubCategory,
	}: {
		category: string;
		subCategory?: string;
		subSubCategory?: string;
	}): string | null => {
		// console.log("Category:", category);
		// console.log("SubCategory:", subCategory);
		// console.log("SubSubCategory:", subSubCategory);

		// First, check if subSubCategory is available, if so, get its ID
		if (subSubCategory) {
			const subSubCategoryId =
				subSubCategoryOptions[subCategory as keyof typeof subSubCategoryOptions]?.find(
					(item: any) => item.value === subSubCategory,
				)?.id || null;
			if (subSubCategoryId) return subSubCategoryId;
		}

		// If subCategory is available, get its ID
		if (subCategory) {
			const selectedCategory = categoryOptions.find((cat) => cat.value === category);
			if (selectedCategory) {
				const selectedSubCategory = selectedCategory.subCategories.find(
					(subCat) => subCat.value === subCategory,
				);
				if (selectedSubCategory) return selectedSubCategory.id;
			}
		}

		// If no subSubCategory or subCategory, return the category ID
		const selectedCategory = categoryOptions.find((cat) => cat.value === category);
		return selectedCategory?.id || null;
	};

	// console.log("formattedCategoryId", formattedCategoryId);

	// console.log("Formatting Product Data:", values);
	console.log("IMAGES", values.images);
	const formattedData = {
		name: values.name,
		rate: parseFloat(values.sellingPrice),
		// sales_rate: parseFloat(values.sellingPrice),
		description: values.description,
		purchase_description: "Purchase Description",
		// category: formattedCategory,
		sku: values.sku,
		upc: values.upc,
		ean: values.ean,
		isbn: values.isbn,
		brand: values.brand,
		manufacturer: values.manufacturer,
		// category_id: formattedCategoryId,
		category_id: formattedCategoryId({
			category: values.category,
			subCategory: values.subCategory,
			subSubCategory: values.subSubCategory,
		}),

		vendor_id: values.vendorId,
		item_type: "inventory",
		product_type: "goods",
		is_returnable: true,
		unit: values.unit,
		account_id: "4650667000000000388",
		purchase_rate: 0.0,
		purchase_account_id: "4650667000000034003",
		inventory_account_id: "4650667000000034001",
		created_time: new Date().toISOString(),
		last_modified_time: new Date().toISOString(),
		custom_fields: customFields,

		sales_channels: [
			{
				// integration_id: 206,
				// product_mapping_id: 206,
				// channel_product_id: "",
				// account_identifier: "",
				// formatted_name: "Zoho Commerce",
				status: "active",
				name: "zstore",
				channel_name: values.name,
				channel_sku: values.sku,
			},
		],

		reorder_level: "",
		minimum_order_quantity: "",
		maximum_order_quantity: "",
		// initial_stock: 10.0,
		// initial_stock_rate: 20.0,
		// total_initial_stock: 0.0,
		// stock_on_hand: 50.0,
		// asset_value: "",
		// available_stock: 220.0,
		// actual_available_stock: 0.0,
		// committed_stock: 0.0,
		// actual_committed_stock: 0.0,
		// available_for_sale_stock: 0.0,
		// actual_available_for_sale_stock: 0.0,
		// quantity_in_transit: 6.0,
		is_storage_location_enabled: false,
		is_fulfillable: false,

		part_number: "",
		is_combo_product: false,
		image_sync_in_progress: false,
		package_details: {
			// length: "10",
			// width: "20",
			// height: "30",
			weight: values.weight,
			weight_unit: values.weight_unit,
			// dimension_unit: "cm",
		},
	};
	// console.log("Formatted Product Data:", formattedData);
	return formattedData;
};
