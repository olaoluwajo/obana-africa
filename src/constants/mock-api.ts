////////////////////////////////////////////////////////////////////////////////
// 🛑 Nothing in here has anything to do with Nextjs, it's just a fake database
////////////////////////////////////////////////////////////////////////////////

import { useVendorStore } from "@/stores/useVendorStore";
import { faker } from "@faker-js/faker";
import { matchSorter } from "match-sorter"; // For filtering

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Define the shape of Product data
export type Product = {
	item_id: any;
	photo_url: string;
	name: string;
	vendorId: any;
	sku: string;
	unit: string;
	status: string;
	description: string;
	created_at: string;
	unitPrice: any;
	id: any;
	category: string;
	subCategory?: string;
	subSubCategory?: string;
	updated_at: string;
	sellingPrice: any;
	account: any;
	salesTaxRule: any;
	weight: any;
	weight_unit: any;
	upc: any;
	mpn: any;
	ean: any;
	isbn: any;
	fob: any;
	manufacturer: string;
	availableColors: string;
	tags: string;
	brand: string;
	sizesRun: string;
	countryOfManufacture: string;
	fabricType: string;
	sizeType: string;
	rate: number;
	unitPerBox: any;
};

// Mock product data store
export const fakeProducts = {
	records: [] as Product[],

	// Initialize with sample data
	initialize() {
		const sampleProducts: Product[] = [];

		// Generate remaining records
		for (let i = 1; i <= 20; i++) {}

		this.records = sampleProducts;
	},

	// Get all products with optional category filtering and search
	async getAll({ categories = [], search }: { categories?: string[]; search?: string }) {
		let products = [...this.records];

		// Filter products based on selected categories
		if (categories.length > 0) {
			products = products.filter((product) => categories.includes(product.category));
		}

		// Search functionality across multiple fields
		if (search) {
			products = matchSorter(products, search, {
				keys: ["name", "description", "category"],
			});
		}

		return products;
	},

	// Get paginated results with optional category filtering and search
	async getProducts({
		page = 1,
		limit = 10,
		categories,
		search,
	}: {
		page?: number;
		limit?: number;
		categories?: string;
		search?: string;
	}) {
		await delay(1000);
		const categoriesArray = categories ? categories.split(".") : [];
		const allProducts = await this.getAll({
			categories: categoriesArray,
			search,
		});
		const totalProducts = allProducts.length;

		// Pagination logic
		const offset = (page - 1) * limit;
		const paginatedProducts = allProducts.slice(offset, offset + limit);

		// Mock current time
		const currentTime = new Date().toISOString();

		// Return paginated response
		return {
			success: true,
			time: currentTime,
			message: "Sample data for testing and learning purposes",
			total_products: totalProducts,
			offset,
			limit,
			products: paginatedProducts,
		};
	},

	// Get a specific product by its ID
	async getProductById(id: number) {
		await delay(1000); // Simulate a delay

		// Find the product by its ID
		const product = this.records.find((product) => product.id === id);

		if (!product) {
			return {
				success: false,
				message: `Product with ID ${id} not found`,
			};
		}

		// Mock current time
		const currentTime = new Date().toISOString();

		return {
			success: true,
			time: currentTime,
			message: `Product with ID ${id} found`,
			product,
		};
	},
};

// Initialize sample products
fakeProducts.initialize();
