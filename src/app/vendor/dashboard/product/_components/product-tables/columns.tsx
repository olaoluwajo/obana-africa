"use client";
import { Product } from "@/constants/mock-api";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<Product, unknown>[] = [
	{
		accessorKey: "cf_singleimage",
		header: "IMAGE",
		cell: ({ row }) => {
			// Parse the image URL from the string
			const imageUrlString = row.getValue("cf_singleimage") as string;
			const imageUrl = imageUrlString ? (JSON.parse(imageUrlString)[0] as string) : null;
			const router = useRouter();

			const itemId = row.original.item_id;

			return (
				<div
					className="relative aspect-square h-10 w-10 cursor-pointer"
					onClick={() => router.push(`/vendor/dashboard/product/view/${itemId}`)}>
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt={row.getValue("name")}
							fill
							className="rounded-lg object-cover"
						/>
					) : (
						<div>
							{" "}
							<Image
								src={"/no-image.png"}
								alt={row.getValue("name")}
								fill
								className="rounded-lg object-cover"
							/>
						</div>
					)}
				</div>
			);
		},
	},
	{
		accessorKey: "cf_product_code_vendor",
		// header: "PRODUCT CODE(vendor)",
		header: "PRODUCT CODE(Vendor)",
		cell: ({ row }) => {
			const productCode = row.getValue("cf_product_code_vendor");

			const truncatedProductCode = productCode?.toString();
			const finalProductCode =
				truncatedProductCode && truncatedProductCode.length > 18
					? `${truncatedProductCode.slice(0, 18)}...`
					: truncatedProductCode;

			return <div>{finalProductCode || "No product code"}</div>;
		},
	},
	{
		accessorKey: "sku",
		header: "PRODUCT CODE(Obana)",
	},
	{
		accessorKey: "name",
		header: "PRODUCT NAME",
		cell: ({ row }) => {
			const productName = row.getValue("name");

			const truncatedProductName = productName?.toString();
			const finalProductName =
				truncatedProductName && truncatedProductName.length > 18
					? `${truncatedProductName.slice(0, 18)}...`
					: truncatedProductName;

			return <div>{finalProductName || "No product name"}</div>;
		},
	},

	{
		accessorKey: "stock_on_hand",
		header: "STOCK",
	},
	{
		accessorKey: "category_name",
		header: "CATEGORY",
		cell: ({ row }) => {
			const category = row.getValue("category_name");
			return <div>{category?.toString() || "No category Selected"}</div>;
		},
	},
	{
		accessorKey: "status",
		header: "STATUS",
		cell: ({ row }) => {
			const status = row.getValue("status");

			const statusStyles = `inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
				status === "active"
					? "border-transparent bg-[#4D9257] text-secondary-foreground hover:bg-[#4D9257]/80"
					: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80"
			}`;
			// const statusStyles = `mx-auto flex justify-center items-center mr-3 text-white px-3 py-1 rounded-full ${
			// 	status === "active" ? "bg-green-400" : "bg-red-400"
			// }`;

			return <div className={statusStyles}>{String(status)}</div>;
		},
	},

	{
		accessorKey: "rate",
		accessorFn: (row) => row.rate,
		header: () => <div className="">PRICE PER BOX</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("rate"));
			const formatPriceToNaira = (price: number) => {
				return `₦${price.toLocaleString("en-NG", {
					minimumFractionDigits: 2,
					maximumFractionDigits: 2,
				})}`;
			};
			const formatted = formatPriceToNaira(amount);
			// const formatted = new Intl.NumberFormat("en-US", {
			// 	style: "currency",
			// 	currency: "NGN",
			// }).format(amount);

			return <div className="place-self-start ">{formatted}</div>;
		},
	},

	{
		accessorKey: "description",
		header: "DESCRIPTION",
		cell: ({ row }) => {
			const description = row.getValue("description");

			const truncatedDescription = description?.toString();
			const finalDescription =
				truncatedDescription && truncatedDescription.length > 20
					? `${truncatedDescription.slice(0, 20)}...`
					: truncatedDescription;

			return <div>{finalDescription || "No description"}</div>;
		},
	},

	{
		id: "actions",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
