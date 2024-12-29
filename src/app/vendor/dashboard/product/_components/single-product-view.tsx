"use client";
import { fetchProductById } from "@/lib/fetchProducts";
import { format } from "date-fns";

import {
	Package,
	Tag,
	Ruler,
	Flag,
	ShoppingCart,
	Timer,
	BarChart,
	User,
	Droplet,
	CheckCircle,
	XCircle,
	Box,
	Palette,
	Shirt,
	Globe,
	Bookmark,
	Barcode,
	CircleDollarSign,
	Store,
	PackageCheck,
	Truck,
	Percent,
	Archive,
	Calculator,
	Scissors,
	FlagOff,
} from "lucide-react";

import ImageGallery from "./image-gallery";
import ProductActions from "./product-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import React, { useEffect } from "react";

type ProductViewPageProps = {
	params: any;
};

const formatDate = (dateString: any) => {
	const date = new Date(dateString);
	return format(date, "yyyy-MM-dd HH:mm");
};

export default async function SingleProductView({ params }: ProductViewPageProps) {
	const { productId } = params;

	const data = await fetchProductById(productId);
	const product = data?.item;

	// console.log("Product ID:", product);
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
				{icon &&
					React.cloneElement(React.Children.only(icon as React.ReactElement), {
						size: 16,
					})}
				<span className="ml-2 font-medium text-gray-600">{label}</span>
			</div>
			<p className="font-semibold text-gray-800">{value}</p>
		</div>
	);

	const renderTagList = (items: any) => {
		if (!items) return null;
		return (
			<div className="flex flex-wrap gap-2">
				{items.split(",").map((item: any) => (
					<span
						key={item}
						className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
						{item.trim()}
					</span>
				))}
			</div>
		);
	};

	const COMMISSION_PERCENTAGE = 10;

	const calculateCommissionPrice = (price: any) => {
		const originalPrice = parseFloat(price);
		const commissionAmount = (originalPrice * COMMISSION_PERCENTAGE) / 100;
		const priceAfterCommission = originalPrice - commissionAmount;
		return priceAfterCommission;
	};

	return (
		<div className="container mx-auto px-4 py-8 bg-white shadow-lg rounded-lg">
			{/* Image Gallery Section */}
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
				<div className="flex items-center justify-center mt-2">
					<div
						className={`text-white py-2 px-3 rounded-lg ${
							product.status === "active" ? "bg-green-800" : "bg-red-500"
						}`}>
						<div className="flex items-center mb-1">
							{product.status === "active" ? <CheckCircle /> : <XCircle />}
							<span className="ml-2 font-medium text-sm">
								{product.status.toUpperCase()}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="grid md:grid-cols-2 gap-8">
				{/* Product Information Section */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center">
							<Package className="mr-2 text-indigo-600" size={20} />
							Product Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailItem
								icon={<Box className="text-purple-600" />}
								label="Product Name"
								value={product.name}
							/>{" "}
							<DetailItem
								icon={<Tag className="text-blue-600" />}
								label="SKU"
								value={product.sku}
							/>
							<div className="col-span-2">
								{/* Description */}
								<h3 className="text-xl text-card-foreground font-semibold border-b pb-2 mt-6">
									Product Description
								</h3>
								<p className="text-gray-700 italic">
									{product.description || "No description available"}
								</p>
							</div>
							<DetailItem
								icon={<Store className="text-green-600" />}
								label="Category"
								value={product.category_name}
							/>
							<DetailItem
								icon={<Flag className="text-red-600" />}
								label="Brand"
								value={product.brand}
							/>
							<DetailItem
								icon={<Flag className="text-red-600" />}
								label="Manufacturer"
								value={product.manufacturer}
							/>
							<DetailItem
								icon={<Box className="text-orange-600" />}
								label="Unit of Measurement"
								value={product.unit}
							/>
							<DetailItem
								icon={<PackageCheck className="text-blue-600" />}
								label="Unit Per Box"
								value={product.custom_field_hash.cf_packs}
							/>{" "}
							<DetailItem
								icon={<Droplet className="text-cyan-600" />}
								label="Weight"
								value={`${product.package_details.weight} ${product.package_details.weight_unit}`}
							/>
							<DetailItem
								icon={<Ruler className="text-pink-600" />}
								label="Dimensions"
								value={`${product.package_details.length}x${product.package_details.width}x${product.package_details.height} ${product.package_details.dimension_unit}`}
							/>
							{/* Colors with tag-like display */}
							<div className="col-span-2">
								<div className="mb-2 flex items-center">
									<Palette className="text-pink-600 mr-2" />
									<span className="font-medium">Available Colors</span>
								</div>
								{renderTagList(product.custom_field_hash.cf_color) || "No Colors available"}
							</div>
							<DetailItem
								icon={<Shirt className="text-emerald-600" />}
								label="Size Type"
								value={product.custom_field_hash.cf_size_type || "No Size available"}
							/>
							<div>
								<div className="mb-2 flex items-center">
									<Shirt className="text-teal-600 mr-2" />
									<span className="font-medium">Sizes Run</span>
								</div>
								{renderTagList(product.custom_field_hash.cf_sizes_run)}
							</div>
							<DetailItem
								icon={<Shirt className="text-emerald-600" />}
								label="Fabric Type"
								value={product.custom_field_hash.cf_fabric_type}
							/>
							<DetailItem
								icon={<Globe className="text-blue-600" />}
								label="Country of Manufacture"
								value={product.custom_field_hash.cf_country_of_manufactutre}
							/>
							<DetailItem
								icon={<Bookmark className="text-yellow-600" />}
								label="ISBN"
								value={product.isbn}
							/>
							<DetailItem
								icon={<Barcode className="text-gray-600" />}
								label="UPC"
								value={product.upc}
							/>
							<DetailItem
								icon={<Barcode className="text-gray-700" />}
								label="EAN"
								value={product.ean}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Vendor Information Section */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center">
							<User className="mr-2 text-violet-600" size={20} />
							Vendor Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailItem
								icon={<Tag className="text-blue-600" />}
								label="Vendor SKU"
								value={product.custom_field_hash.cf_product_code_vendor}
							/>
							<DetailItem
								icon={<CircleDollarSign className="text-green-600" />}
								label="FOB"
								value={product.custom_field_hash.cf_fob}
							/>
							<DetailItem
								icon={<Globe className="text-purple-600" />}
								label="INCOTERMS"
								value={product.custom_field_hash.cf_incoterms}
							/>
							<DetailItem
								icon={<FlagOff className="text-orange-600" />}
								label="Is Product Returnable?"
								value={product.is_returnable ? "Yes" : "No"}
							/>
							<DetailItem
								icon={<Scissors className="text-green-600" />}
								label="Is Sample Available"
								value={product.custom_field_hash.cf_sample_available ? "Yes" : "No"}
							/>
						</div>
						{product.custom_field_hash.cf_tags && (
							<div className="mt-4">
								<div className="mb-2 flex items-center">
									<Tag className="text-indigo-600 mr-2" />
									<span className="font-medium">Tags</span>
								</div>
								{renderTagList(product.custom_field_hash.cf_tags)}
							</div>
						)}
					</CardContent>
				</Card>

				{/* Sales Information Section */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center">
							<BarChart className="mr-2 text-emerald-600" size={20} />
							Sales Information
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailItem
								icon={<CircleDollarSign className="text-green-600" />}
								label="Price Per Unit"
								value={new Intl.NumberFormat("en-NG", {
									style: "currency",
									currency: "NGN",
								}).format(product.custom_field_hash.cf_item_price_unformatted)}
							/>
							<DetailItem
								icon={<CircleDollarSign className="text-green-600" />}
								label="Price Per Pack"
								value={new Intl.NumberFormat("en-NG", {
									style: "currency",
									currency: "NGN",
								}).format(product.rate)}
							/>
							<DetailItem
								icon={<PackageCheck className="text-blue-600" />}
								label="Opening Stock(Box)"
								value={product.initial_stock}
							/>
							<DetailItem
								icon={<ShoppingCart className="text-purple-600" />}
								label="Available to Sell(Box)"
								value={`${product.available_for_sale_stock} units`}
							/>
							<DetailItem
								icon={<Archive className="text-amber-600" />}
								label="Committed Stock(Box)"
								value={`${product.actual_committed_stock || 0} units`}
							/>
							<DetailItem
								icon={<Truck className="text-orange-600" />}
								label="Quantity in Transit(Box)"
								value={product.quantity_in_transit}
							/>
						</div>
					</CardContent>
				</Card>

				{/* New Additional Details Section */}
				<Card className="mb-8">
					<CardHeader>
						<CardTitle className="flex items-center">
							<Calculator className="mr-2 text-rose-600" size={20} />
							Additional Details
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid grid-cols-2 gap-4">
							<DetailItem
								icon={<Percent className="text-pink-600" />}
								label="Commission Rate"
								value={`${COMMISSION_PERCENTAGE}%`}
							/>{" "}
							<DetailItem
								icon={<CircleDollarSign className="text-emerald-600" />}
								label="Total Sales Amount"
								value={new Intl.NumberFormat("en-NG", {
									style: "currency",
									currency: "NGN",
								}).format(product.rate)}
							/>
							<DetailItem
								icon={<CircleDollarSign className="text-emerald-600" />}
								label="Payable Commision"
								value={new Intl.NumberFormat("en-NG", {
									style: "currency",
									currency: "NGN",
								}).format((parseFloat(product.rate) * COMMISSION_PERCENTAGE) / 100)}
							/>
							<DetailItem
								icon={<CircleDollarSign className="text-purple-600" />}
								label="Payable After Commission"
								value={new Intl.NumberFormat("en-NG", {
									style: "currency",
									currency: "NGN",
								}).format(calculateCommissionPrice(product.rate))}
							/>
						</div>
						<div className="grid grid-cols-2 gap-4">
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
					</CardContent>
				</Card>
			</div>

			<ProductActions productId={productId} initialStatus={product.status} />
		</div>
	);
}
