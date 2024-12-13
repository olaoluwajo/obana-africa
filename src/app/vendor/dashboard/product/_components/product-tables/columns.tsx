"use client";
import { Product } from "@/constants/mock-api";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Product, unknown>[] = [
	{
		accessorKey: "cf_singleimage",
		header: "IMAGE",
		cell: ({ row }) => {
			// Parse the image URL from the string
			const imageUrlString = row.getValue("cf_singleimage") as string;
			const imageUrl = imageUrlString ? (JSON.parse(imageUrlString)[0] as string) : null;

			return (
				<div className="relative aspect-square h-10 w-10">
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
		accessorKey: "sku",
		header: "SKU",
	},
	{
		accessorKey: "name",
		accessorFn: (row) => row.name,
		header: "NAME",
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
	},
	{
		accessorKey: "rate",
		accessorFn: (row) => row.rate,
		header: () => <div className="">PRICE</div>,
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
