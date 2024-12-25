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
		header: "PRODUCT CODE(vendor)",
	},
	{
		accessorKey: "sku",
		header: "PRODUCT CODE(obana)",
	},

	{
		accessorKey: "name",
		accessorFn: (row) => row.name,
		header: "PRODUCT NAME",
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

			const statusStyles = `mx-auto flex justify-center items-center mr-3 text-white px-3 py-1 rounded-full ${
				status === "active" ? "bg-green-400" : "bg-red-400"
			}`;

			return <div className={statusStyles}>{String(status)}</div>;
		},
	},

	{
		accessorKey: "rate",
		accessorFn: (row) => row.rate,
		header: () => <div className="">PRICE PER BOX</div>,
		cell: ({ row }) => {
			const amount = parseFloat(row.getValue("rate"));
			const formatted = new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "NGN",
			}).format(amount);

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
