import ProductTableAction from "../../_components/product-tables/product-table-action";
import { Suspense } from "react";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/ui/heading";
import PageContainer from "@/components/layout/page-container";
import { DataTableSkeleton } from "@/components/ui/table/data-table-skeleton";
import SingleProductView from "../../_components/single-product-view";

export const metadata = {
	title: "Dashboard: Products View",
};

type PageProps = {
	params: any;
};
export default async function Page({ params }: PageProps) {
	const productId = params.productId;

	// console.log("Search id", productId);

	return (
		<PageContainer>
			<div className="space-y-4">
				<div className="flex items-start justify-between">
					<Heading title="Products" description="View Product" />
				</div>
				<Separator />
				{/* <ProductTableAction /> */}
				<Suspense fallback={<DataTableSkeleton columnCount={2} rowCount={10} />}>
					{productId ? (
						<SingleProductView params={{ productId }} />
					) : (
						<div className="h-[300px] p-4 text-center text-red-500 font-bold text-2xl flex items-center justify-center">
							Product is missing.
						</div>
					)}
				</Suspense>
			</div>
		</PageContainer>
	);
}
