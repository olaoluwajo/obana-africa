import { formatProductData } from "@/utils/formatProductData";
import axios from "axios";
import { toast } from "sonner";

// Upload images function
export const uploadImages = async (images: File[]): Promise<string[]> => {
	const urls: string[] = [];
	for (const image of images) {
		const formData = new FormData();
		formData.append("image", image);

		try {
			const response = await axios.post("/api/uploadImage", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});

			if (response.status === 200) {
				urls.push(response.data.url);
				console.log("Image uploaded successfully:", response.data.url);
			} else {
				console.error("Image upload failed:", response.data.error);
				toast.error("Image upload failed");
			}
		} catch (error: any) {
			console.error("Error uploading image:", error.message);
			toast.error("Error uploading image");
		}
	}

	return urls;
};

// Create product function
export const createProduct = async (values: any, images: File[]) => {
	const uploadedUrls = images.length > 0 ? await uploadImages(images) : [];
	const formattedProductData = formatProductData({
		...values,
		images: uploadedUrls,
	});

	try {
		const response = await axios.post("/api/create-product", {
			vendorId: values.vendorId,
			productData: formattedProductData,
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data.message || "Error creating product");
	}
};

//edit product function

export const editProduct = async (productId: string, values: any, images: File[]) => {
	const uploadedUrls = images.length > 0 ? await uploadImages(images) : [];
	const formattedProductData = formatProductData({
		...values,
		images: uploadedUrls,
	});
	console.log('ProductId',productId)
	console.log(formattedProductData);

	try {
		const response = await axios.put(`/api/edit-product`, {
			productData: formattedProductData,
			productId,
		});
		return response.data;
	} catch (error: any) {
		throw new Error(error.response?.data.message || "Error editing product");
	}
};
