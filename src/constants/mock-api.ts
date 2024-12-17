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
		function generateRandomProductData(id: number): Product {
			const categories = [
				"Electronics",
				"Furniture",
				"Clothing",
				"Toys",
				"Groceries",
				"Books",
				"Jewelry",
				"Beauty Products",
			];
			const vendorId = useVendorStore.getState().vendorId;

			return {
				id,
				item_id: id,
				vendorId: vendorId,
				name: faker.commerce.productName(),
				weight: faker.number.int({ min: 1, max: 100 }),
				weight_unit: faker.helpers.arrayElement(["kg", "g", "mg", "oz", "lb"]),
				rate: faker.number.int({ min: 1, max: 5 }),
				unitPerBox: faker.number.int({ min: 1, max: 10 }),
				sellingPrice: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
				sizesRun: faker.helpers.arrayElement(["M-4XL", "S-M", "L-XL", "S-XL", "M-XL"]),
				countryOfManufacture: faker.helpers.arrayElement([
					"Nigeria",
					"Ghana",
					"Kenya",
					"South Africa",
					"Nigeria",
				]),
				fabricType: faker.helpers.arrayElement([
					"Cotton",
					"Polyester",
					"Wool",
					"Silk",
					"Linen",
				]),

				sizeType: faker.helpers.arrayElement([
					"Small",
					"Medium",
					"Large",
					"X-Large",
					"XX-Large",
				]),
				account: faker.string.uuid().slice(0, 10),
				availableColors: faker.helpers.arrayElement([
					"Red",
					"Blue",
					"Green",
					"Yellow",
					"Purple",
				]),
				tags: faker.helpers.arrayElement(["Tag1", "Tag2", "Tag3", "Tag4", "Tag5"]),
				salesTaxRule: faker.string.uuid().slice(0, 10),
				upc: faker.number.int({ min: 100000000000, max: 999999999999 }),
				mpn: faker.number.int({ min: 1000000000000, max: 9999999999999 }),
				ean: faker.number.int({ min: 1000000000000, max: 9999999999999 }),
				isbn: faker.number.int({ min: 1000000000000, max: 9999999999999 }),
				manufacturer: faker.company.name(),
				brand: faker.commerce.productName(),
				fob: faker.number.int({ min: 1, max: 100 }),
				description: faker.commerce.productDescription().slice(0, 30) + "...",
				sku: faker.string.uuid().slice(0, 10),
				unit: faker.helpers.arrayElement(["kg", "pcs", "litre", "pack"]),
				status: faker.helpers.arrayElement(["active", "inactive"]),
				created_at: faker.date.between({ from: "2022-01-01", to: "2023-12-31" }).toISOString(),
				unitPrice: parseFloat(faker.commerce.price({ min: 5, max: 500, dec: 2 })),
				photo_url: `https://api.slingacademy.com/public/sample-products/${id}.png`,
				category: faker.helpers.arrayElement(categories),
				updated_at: faker.date.recent().toISOString(),
			};
		}

		// Generate remaining records
		for (let i = 1; i <= 20; i++) {
			sampleProducts.push(generateRandomProductData(i));
		}

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
