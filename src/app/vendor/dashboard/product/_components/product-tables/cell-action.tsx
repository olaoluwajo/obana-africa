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
// import { Product } from "@/constants/data";
import { Product } from "@/constants/mock-api";
import { deleteProduct } from "@/lib/product-utils";
import { CopyPlus, Edit, Eye, MoreHorizontal, Trash } from "lucide-react";
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

	const onConfirm = async () => {
		try {
			setLoading(true);
			await deleteProduct(data.item_id);
			toast.success(`Product deleted successfully`);
			router.refresh();
			setSuccessModalOpen(true);
		} catch (error: any) {
			console.log("ERROR", error);
			setErrorMessage(error.message);
			// setErrorMessage("Failed to delete the product. Please try again.");
			setSuccessModalOpen(true);
		} finally {
			setOpen(false);
			setLoading(false);
			router.refresh();
		}
	};

	return (
		<>
			{loading ? (
				// Show loading state
				<Loader message="Deleting product..." />
			) : (
				<>
					{/* Confirmation Modal */}
					<AlertModal
						isOpen={open}
						onClose={() => setOpen(false)}
						onConfirm={onConfirm}
						loading={loading}
						title="Are you sure?"
						description="This action cannot be undone."
					/>

					{/* Success/Error Modal */}
					{successModalOpen && (
						<AlertModal
							isOpen={successModalOpen}
							onClose={() => setSuccessModalOpen(false)}
							onConfirm={() => setSuccessModalOpen(false)}
							loading={loading}
							title={errorMessage ? "Error" : "Success"}
							description={errorMessage || "Product deleted successfully!"}
							success={errorMessage === ""}
							cancelLabel="Close"
							confirmLabel={errorMessage ? "Okay" : "Okay"}
						/>
					)}

					{/* Dropdown menu for other actions */}
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
								onClick={() => router.push(`/vendor/dashboard/product/${data.item_id}`)}>
								<CopyPlus className="mr-2 h-4 w-4" />
								Duplicate
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => setOpen(true)}>
								<Trash className="mr-2 h-4 w-4" /> Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			)}
		</>
	);
};
