// import axios from "axios";

// export const fetchProductsServerSide = async (queryParams: Record<string, string>) => {
// 	try {
// 		const response = await axios.get(`${process.env.NEXT_PUBLIC_BASE_URL}/api/fetch-products`, {
// 			params: queryParams,
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		});

// 		return {
// 			products: response.data.products,
// 			totalProducts: response.data.total_products,
// 		};
// 	} catch (error) {
// 		console.error("Error fetching products:", error);
// 		return { products: [], totalProducts: 0 };
// 	}
// };
