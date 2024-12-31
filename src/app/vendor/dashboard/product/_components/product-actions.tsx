"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import ItemToggleButton from "./toogle-btn";

export default function ProductActions({
	productId,
	initialStatus,
}: {
	productId: string;
	initialStatus: any;
}) {
	const router = useRouter();
	const [loadingStates, setLoadingStates] = useState({
		edit: false,
		duplicate: false,
		delete: false,
	});

	const handleEdit = async () => {
		if (!productId) {
			console.error("Product ID is required.");
			return;
		}
		setLoadingStates((prev) => ({ ...prev, edit: true }));
		// console.log(`Redirecting to edit page for product ID: ${productId}`);
		router.push(`/vendor/dashboard/product/${productId}`);
	};

	const handleDuplicate = async () => {
		if (!productId) {
			console.error("Product ID is required.");
			return;
		}
		setLoadingStates((prev) => ({ ...prev, duplicate: true }));
		// console.log(`Redirecting to edit page for product ID: ${productId}`);
		router.push(`/vendor/dashboard/product/${productId}?duplicate=true`);
	};

	const handleDelete = async () => {
		const confirmed = confirm("Are you sure you want to delete this product?");
		if (confirmed) {
			setLoadingStates((prev) => ({ ...prev, delete: true }));
			// console.log(`Deleting product with ID: ${productId}`);
			// Add logic to call the delete API
			try {
				// await deleteProduct(productId);
				router.push("/vendor/dashboard/products"); // Redirect after deletion
			} catch (error) {
				console.error("Failed to delete product:", error);
				setLoadingStates((prev) => ({ ...prev, delete: false }));
			}
		}
	};

	return (
		<div className="mt-6 flex justify-end space-x-4">
			<button
				onClick={handleEdit}
				disabled={loadingStates.edit}
				className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
				{loadingStates.edit ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
				Edit Product
			</button>
			<button
				onClick={handleDuplicate}
				disabled={loadingStates.duplicate}
				className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]">
				{loadingStates.duplicate ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
				Duplicate
			</button>

			<ItemToggleButton itemId={productId} initialStatus={initialStatus} />
		</div>
	);
}
