"use client";
import { Product } from "@/constants/mock-api";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Product, unknown>[] = [
	{
		accessorKey: "photo_url",
		header: "IMAGE",
		cell: ({ row }) => {
			return (
				<div className="relative aspect-square h-10 w-10">
					<Image
						src={row.getValue("photo_url")}
						alt={row.getValue("name")}
						fill
						className="rounded-lg object-cover"
					/>
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
		accessorKey: "category",
		header: "CATEGORY",
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
				currency: "USD",
			}).format(amount);

			return <div className="place-self-start ">{formatted}</div>;
		},
	},
	{
		accessorKey: "description",
		header: "DESCRIPTION",
	},

	{
		id: "actions",
		cell: ({ row }) => <CellAction data={row.original} />,
	},
];
