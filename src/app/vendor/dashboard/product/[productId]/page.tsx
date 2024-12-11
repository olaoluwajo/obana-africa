'use client'
import FormCardSkeleton from "@/components/form-card-skeleton";
import PageContainer from "@/components/layout/page-container";
import { Suspense } from "react";
import ProductViewPage from "../_components/product-view-page";
// import ItemImage from "../upload/page";

// export const metadata = {
// 	title: "Dashboard : Product View",
// };

type PageProps = { params: { productId: string } };

export default function Page({ params }: PageProps) {
	const itemId = "4650667000014573495";
	return (
		<>
			<PageContainer scrollable>
				<div className="flex-1 space-y-4">
					<Suspense fallback={<FormCardSkeleton />}>
						<ProductViewPage productId={params.productId} />
					</Suspense>
				</div>
			</PageContainer>

			{/* <ItemImage itemId={itemId} /> */}
		</>
	);
}
