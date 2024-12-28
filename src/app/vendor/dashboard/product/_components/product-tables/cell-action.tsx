"use client";
import Loader from "@/components/loader";
import { AlertModal } from "@/components/modal/alert-modal";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Product } from "@/constants/mock-api";
import axios from "axios";
import { ArchiveX, CopyPlus, Edit, Eye, MoreHorizontal, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface CellActionProps {
	data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
	const [loading, setLoading] = useState(false);
	const [open, setOpen] = useState(false);
	const [successModalOpen, setSuccessModalOpen] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const router = useRouter();

	const toggleItemStatus = async () => {
		setLoading(true);

		try {
			const response = await axios.post("/api/toggle-status", {
				itemId: data.item_id,
				currentStatus: data.status,
			});

			if (response.data.success) {
				toast.success(
					`Product status updated to ${data.status === "active" ? "inactive" : "active"}`,
				);

				// Force a hard refresh of the page
				window.location.reload();

				// Alternative approach using router
				router.push(window.location.pathname);
				router.refresh();
			} else {
				console.error("Failed to toggle item status:", response.data.message);
				toast.error("Failed to update product status");
			}
		} catch (error) {
			console.error("Error:", error);
			toast.error("An error occurred while updating the status");
		} finally {
			setLoading(false);
			setOpen(false);
		}
	};

	return (
		<>
			{loading ? (
				<Loader message="Processing..." />
			) : (
				<>
					<AlertModal
						isOpen={open}
						onClose={() => setOpen(false)}
						onConfirm={toggleItemStatus}
						loading={loading}
						title="Are you sure?"
						description={`This will set the product status to ${
							data.status === "active" ? "inactive" : "active"
						}.`}
					/>

					<DropdownMenu modal={false}>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuLabel>Actions</DropdownMenuLabel>
							<DropdownMenuItem onClick={() => navigator.clipboard.writeText(data.sku)}>
								Copy SKU
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									router.push(`/vendor/dashboard/product/view/${data.item_id}`)
								}>
								<Eye className="mr-2 h-4 w-4" /> View details
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => router.push(`/vendor/dashboard/product/${data.item_id}`)}>
								<Edit className="mr-2 h-4 w-4" /> Update Product
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() =>
									router.push(`/vendor/dashboard/product/${data.item_id}?duplicate=true`)
								}>
								<CopyPlus className="mr-2 h-4 w-4" />
								Duplicate
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setOpen(true)}>
								{data.status === "active" ? (
									<ArchiveX className="mr-2 h-4 w-4 text-red-600" />
								) : (
									<ShoppingBag className="mr-2 h-4 w-4 text-green-600" />
								)}
								Set {data.status === "active" ? "Inactive" : "Active"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			)}
		</>
	);
};
