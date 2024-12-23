import { fetchProductById } from "@/lib/fetchProducts";
import { format } from "date-fns";
import { redirect } from "next/navigation";

import {
	Package,
	Tag,
	ShoppingCart,
	Ruler,
	Droplet,
	Flag,
	User,
	BarChart,
	XCircle,
	CheckCircle,
	Timer,
} from "lucide-react";
import ImageGallery from "./image-gallery";
import ProductActions from "./product-actions";
import { deleteProduct } from "@/lib/product-utils";

type ProductViewPageProps = {
	params: any;
};

const formatDate = (dateString: any) => {
	const date = new Date(dateString);
	return format(date, "yyyy-MM-dd HH:mm");
};

export default async function SingleProductView({ params }: ProductViewPageProps) {
	const { productId } = params;
	// console.log("Product ID:", productId);

	const data = await fetchProductById(productId);
	const product = data?.item;

	// Parse images from custom_field_hash
	const productImages = product?.custom_field_hash?.cf_productimages
		? JSON.parse(product.custom_field_hash.cf_productimages).map((url: string) => ({
				largeURL: url,
				thumbnailURL: url,
				width: 800,
				height: 800,
		  }))
		: [];

	// Helper function for rendering detail items
	const DetailItem = ({
		icon,
		label,
		value,
		valueClassName = "",
	}: {
		icon?: React.ReactNode;
		label: string;
		value: string | number;
		valueClassName?: string;
	}) => (
		<div className="bg-gray-50 p-3 rounded-lg">
			<div className="flex items-center mb-1">
				{icon}
				<span className="ml-2 font-medium text-gray-600">{label}</span>
			</div>
			<p className="font-semibold text-gray-800">{value}</p>
		</div>
	);

	async function handleEdit(productId: any) {
		"use server";
		if (!productId) {
			console.error("Product ID is required.");
			return;
		}
		// Logic to navigate to an edit form ( `/edit-product/${productId}`)
		console.log("Redirecting to edit page...");
		try {
			console.log(`Redirecting to edit page for product ID: ${productId}`);
			redirect(`/vendor/dashboard/product/${productId}`);
		} catch (error) {
			console.error("Error during redirection:", error);
		}
	}

	async function handleDelete() {
		"use server";
		// Logic to delete the product via API
		const confirmed = confirm("Are you sure you want to delete this product?");
		if (confirmed) {
			console.log(`Deleting product with ID: ${productId}`);
			await deleteProduct(productId);
			redirect(`/vendor/dashboard/product`);
			//  delete API  ( await deleteProduct(productId))
		}
	}

	return (
		<div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg text-card-fore">
			<div className="mb-8">
				<h2 className="text-2xl font-bold mb-4 flex items-center text-card-foreground">
					<Package className="mr-2 text-blue-600" size={24} />
					Product Images
				</h2>

				{productImages.length > 0 ? (
					<ImageGallery galleryID="product-gallery" images={productImages} />
				) : (
					<div className="text-gray-500 text-center py-4">No images available</div>
				)}
			</div>

			{/* Product Header */}
			<div className="text-center mb-8">
				<h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
				<p className="text-xl text-blue-600 font-semibold">
					{new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
						product.rate,
					)}
				</p>
				<div className=" flex items-center justify-center mt-2">
					<div
						className={`text-white py-2 px-3 rounded-lg ${
							product.status === "active" ? "bg-green-800" : "bg-red-500"
						}`}>
						<div className="flex items-center mb-1">
							{product.status === "active" ? (
								<CheckCircle className="" />
							) : (
								<XCircle className="" />
							)}
							<span className="ml-2 font-medium text-sm">
								{product.status.toUpperCase()}
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* Product Details Grid */}
			<div className="grid md:grid-cols-2 gap-8">
				{/* Left Column */}
				<div className="space-y-4">
					<h3 className="text-xl text-card-foreground font-semibold  border-b pb-2 flex items-center">
						<Tag className="mr-2 text-blue-600" size={20} />
						Product Basics
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<DetailItem
							icon={<Ruler className="text-blue-500" size={20} />}
							label="SKU"
							value={product.sku}
						/>
						<DetailItem
							icon={<Ruler className="text-green-500" size={20} />}
							label="VENDOR SKU"
							value={product.custom_field_hash.cf_product_code_vendor}
						/>
						<DetailItem
							icon={<Flag className="text-green-500" size={20} />}
							label="Brand"
							value={product.brand}
						/>
						<DetailItem
							icon={<Package className="text-purple-500" size={20} />}
							label="Category"
							value={product.category_name}
						/>
						<DetailItem
							icon={<ShoppingCart className="text-red-500" size={20} />}
							label="Available to Sell"
							value={`${product.stock_on_hand} units`}
						/>
						<DetailItem
							icon={<Timer className="text-blue-500" size={20} />}
							label="Created Time"
							value={formatDate(product.created_time)}
						/>
						<DetailItem
							icon={<Timer className="text-red-500" size={20} />}
							label="Last Updated Time"
							value={formatDate(product.last_modified_time)}
						/>
					</div>

					{/* Pricing Details */}
					<h3 className="text-xl font-semibold border-b pb-2 flex items-center mt-6 text-card-foreground">
						<BarChart className="mr-2 text-blue-600" size={20} />
						Pricing Information
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<DetailItem
							icon={<Tag className="text-green-500" size={20} />}
							label="Price Per Unit"
							value={new Intl.NumberFormat("en-NG", {
								style: "currency",
								currency: "NGN",
							}).format(product.custom_field_hash.cf_item_price_unformatted)}
						/>
						<DetailItem
							icon={<Droplet className="text-blue-500" size={20} />}
							label="Initial Stock"
							value={product.initial_stock}
						/>
					</div>
				</div>

				{/* Right Column */}
				<div className="space-y-4">
					<h3 className="text-xl text-card-foreground font-semibold border-b pb-2 flex items-center">
						<User className="mr-2 text-blue-600" size={20} />
						Additional Details
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<DetailItem label="Color" value={product.custom_field_hash.cf_color || "N/A"} />
						<DetailItem
							label="Fabric Type"
							value={product.custom_field_hash.cf_fabric_type || "N/A"}
						/>
						<DetailItem
							label="Sizes Run"
							value={product.custom_field_hash.cf_sizes_run || "N/A"}
						/>
						<DetailItem
							label="Country of Manufacture"
							value={product.custom_field_hash.cf_country_of_manufactutre || "N/A"}
						/>
					</div>
				</div>
			</div>
			<div className="grid md:grid-cols-2 gap-8">
				<div className="space-y-8">
					<h3 className="text-xl font-semibold border-b pb-2 flex items-center text-card-foreground mt-10">
						<Tag className="mr-2 text-blue-600" size={20} />
						Product product
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<DetailItem
							icon={<Ruler className="text-teal-600" />}
							label="UPC"
							value={product.upc}
						/>
						<DetailItem
							icon={<Ruler className="text-teal-600" />}
							label="EAN"
							value={product.ean}
						/>
						<DetailItem
							icon={<Ruler className="text-teal-600" />}
							label="ISBN"
							value={product.isbn}
						/>
						<DetailItem
							icon={<Ruler className="text-teal-600" />}
							label="FOB"
							value={product.custom_field_hash.cf_fob}
						/>
					</div>

					{/* Pricing Details */}
					<h3 className="text-xl font-semibold border-b pb-2 flex items-center text-card-foreground mt-6">
						<BarChart className="mr-2 text-blue-600" size={20} />
						Product Weight and Dimensions
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<DetailItem
							icon={<Droplet className="text-indigo-600" />}
							label="Weight"
							value={`${product.package_details.weight} ${product.package_details.weight_unit}`}
						/>
						<DetailItem
							icon={<Ruler className="text-pink-600" />}
							label="Dimensions"
							value={`${product.package_details.length}x${product.package_details.width}x${product.package_details.height} ${product.package_details.dimension_unit}`}
						/>
					</div>
				</div>

				{/* Right Column */}
				<div className="space-y-4">
					<h3 className="text-xl text-card-foreground font-semibold border-b pb-2 flex items-center">
						<User className="mr-2 text-blue-600" size={20} />
						Additional Details
					</h3>
					<div className="grid grid-cols-2 gap-4">
						<DetailItem label="Incoterms" value={product.custom_field_hash.cf_incoterms} />
						<DetailItem label="FOB" value={product.custom_field_hash.cf_fob} />
						<DetailItem label="Unit" value={product.unit} />
						<DetailItem label="Product Type" value={product.product_type} />
						<DetailItem label="Returnable" value={product.is_returnable ? "Yes" : "No"} />
						<DetailItem label="Quantity in Transit" value={product.quantity_in_transit} />
					</div>

					{/* Tags */}
					{product.custom_field_hash.cf_tags && (
						<div className="mt-8">
							<h3 className="text-xl text-card-foreground font-semibold border-b pb-2 mb-4">
								Product Tags
							</h3>
							<div className="flex flex-wrap gap-2">
								{product.custom_field_hash.cf_tags.split(",").map((tag: string) => (
									<span
										key={tag}
										className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
										{tag.trim()}
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Description */}
			<h3 className="text-xl text-card-foreground font-semibold border-b pb-2 mt-6">
				Product Description
			</h3>
			<p className="text-gray-700 italic">{product.description || "No description available"}</p>

			<ProductActions productId={productId} />
		</div>
	);
}
