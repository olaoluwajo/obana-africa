import { notFound } from "next/navigation";
import ProductForm from "./product-form";
import { fetchProductById } from "@/lib/fetchProducts";
import { mapProductDataToForm } from "@/utils/mapProductDataToForm";
import { Product } from "@/constants/mock-api";

type TProductViewPageProps = {
	productId: string;
};

// export default async function ProductViewPage({ productId }: TProductViewPageProps) {
// 	let product = null;
// 	let pageTitle = "Create New Product";

// 	if (productId !== "new") {
// 		// Fetch product data from your backend
// 		const data = await fetchProductById(productId);
// 		// console.log("data", data);
// 		product = data?.item;
// 		// console.log("product", product);

// 		if (!product) {
// 			notFound();
// 		}

// 		const initialData = mapProductDataToForm(product);
// 		console.log("initial data", initialData);

// 		pageTitle = `Edit Product: ${product.name}`;
// 		return <ProductForm initialData={initialData} pageTitle={pageTitle} productId={productId} />;
// 	}

// 	return <ProductForm initialData={product} pageTitle={pageTitle} productId={productId} />;
// }


export default async function ProductViewPage({ productId }: TProductViewPageProps) {
	let product = null;
	let pageTitle = "Create New Product";

	// Get the searchParams to check if we're duplicating
	const searchParams = new URLSearchParams(window.location.search);
	const isDuplicating = searchParams.get("duplicate") === "true";

	if (productId !== "new") {
		// Fetch product data from your backend
		const data = await fetchProductById(productId);
		product = data?.item;

		if (!product) {
			notFound();
		}

		const initialData = mapProductDataToForm(product);
		console.log("initial data", initialData);

		// Change the page title and productId based on whether we're duplicating
		if (isDuplicating) {
			pageTitle = `Create New Product (Copied from: ${product.name})`;
			return (
				<ProductForm
					initialData={initialData}
					pageTitle={pageTitle}
					productId="new"
					isDuplicating={true}
				/>
			);
		} else {
			pageTitle = `Edit Product: ${product.name}`;
			return (
				<ProductForm initialData={initialData} pageTitle={pageTitle} productId={productId} />
			);
		}
	}

	return <ProductForm initialData={product} pageTitle={pageTitle} productId={productId} />;
}