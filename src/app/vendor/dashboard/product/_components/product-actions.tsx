"use client";

import { useRouter } from "next/navigation";

export default function ProductActions({ productId }: { productId: string }) {
	const router = useRouter();

	const handleEdit = () => {
		if (!productId) {
			console.error("Product ID is required.");
			return;
		}
		console.log(`Redirecting to edit page for product ID: ${productId}`);
		router.push(`/vendor/dashboard/product/${productId}`);
	};
	const handleDuplicate = () => {
		if (!productId) {
			console.error("Product ID is required.");
			return;
		}
		console.log(`Redirecting to edit page for product ID: ${productId}`);
		router.push(`/vendor/dashboard/product/${productId}?duplicate=true`);
	};

	const handleDelete = () => {
		const confirmed = confirm("Are you sure you want to delete this product?");
		if (confirmed) {
			console.log(`Deleting product with ID: ${productId}`);
			// Add logic to call the delete API
		}
	};

	return (
		<div className="mt-6 flex justify-end space-x-4">
			<button
				onClick={handleEdit}
				className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
				Edit Product
			</button>
			<button
				onClick={handleDuplicate}
				className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
				Duplicate
			</button>
			<button
				onClick={handleDelete}
				className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition">
				Delete Product
			</button>
		</div>
	);
}
