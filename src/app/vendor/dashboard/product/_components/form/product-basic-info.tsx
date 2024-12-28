import { useEffect, useState } from "react";

import { WeightInput, TextInput } from "../inputs/text-input";
import { Images } from "lucide-react";

interface Image {
	url: string;
	name?: string;
}
interface ProductBasicInfoProps {
	form: any;
	images: File[];
	setImages: React.Dispatch<React.SetStateAction<File[]>>;
	initialImages?: Image[];
	isLoading: boolean;
	productId: string;
	initialData?: any;
}

export default function ProductBasicInfo({
	form,
	images,
	setImages,
	productId,
	initialData,
}: ProductBasicInfoProps) {
	const [showImage, setShowImage] = useState<Image[]>([]);

	// Initialize the states with initial images
	useEffect(() => {
		const loadInitialImages = async () => {
			// Check if we have initial image data and we're not in "new" mode
			if (productId !== "new" && initialData?.image) {
				console.log("Initial data image:", initialData?.image);

				// Convert string to array if single image
				const imageUrls = Array.isArray(initialData.image)
					? initialData.image
					: [initialData.image];

				// Set initial preview images immediately
				setShowImage(
					imageUrls.map((url: any, index: any) => ({
						url,
						name: `Product-image-${index + 1}.jpg`,
					})),
				);

				// Convert URLs to files in background
				const urlToFile = async (url: string, index: number) => {
					try {
						const response = await fetch(url);
						const blob = await response.blob();
						const fileName = `Product-image-${index + 1}.jpg`;
						const file = new File([blob], fileName, { type: blob.type });
						Object.assign(file, { preview: url });
						return file;
					} catch (error) {
						console.error(`Error converting URL to file: ${error}`);
						return null;
					}
				};

				const filePromises = imageUrls.map((url: any, index: any) => urlToFile(url, index));
				const files = await Promise.all(filePromises);
				const validFiles = files.filter((file): file is File => file !== null);
				setImages(validFiles);
			} else {
				console.log("NO INITIAL DATA");
			}
		};

		loadInitialImages();

		// Cleanup function
		return () => {
			images.forEach((file: any) => {
				if (file.preview) {
					URL.revokeObjectURL(file.preview);
				}
			});
		};
	}, [productId, initialData?.image]);

	// Handle adding new images
	const imageHandle = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		// Prevent adding more than 4 images
		if (images.length >= 4) {
			alert("You can only add up to 4 images.");
			return;
		}

		const newFiles = Array.from(files).slice(0, 4 - images.length);
		setImages((prev) => [...prev, ...newFiles]);

		const newImageUrls = newFiles.map((file) => ({
			url: URL.createObjectURL(file),
			name: file.name,
		}));
		setShowImage((prev) => [...prev, ...newImageUrls]);
	};

	const changeImage = (file: File, index: number) => {
		const updatedImages = [...images];
		updatedImages[index] = file;
		setImages(updatedImages);

		const updatedShowImage = [...showImage];
		updatedShowImage[index] = { url: URL.createObjectURL(file), name: file.name };
		setShowImage(updatedShowImage);
	};

	const removeImage = (index: number) => {
		setImages((prev) => prev.filter((_, i) => i !== index));
		setShowImage((prev) => prev.filter((_, i) => i !== index));
	};

	return (
		<div className="space-y-6">
			<div className="grid w-full grid-cols-2 gap-3 mb-4 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 sm:gap-4 md:gap-4">
				{showImage.map((img, i) => (
					<div key={i} className="h-[200px] relative border-2">
						<label htmlFor={`image-${i}`}>
							<img
								className="w-full h-full transition-all duration-700 rounded-sm cursor-pointer object-contain"
								src={img.url}
								alt={img.name || `Uploaded Image ${i + 1}`}
							/>
						</label>
						<input
							onChange={(e) => e.target.files && changeImage(e.target.files[0], i)}
							type="file"
							id={`image-${i}`}
							className="hidden"
						/>
						<span
							onClick={() => removeImage(i)}
							className="absolute z-10 p-2 bg-red-800 text-white rounded-md cursor-pointer hover:shadow-lg hover:shadow-red-400/50 top-2 right-3 text-xs">
							Remove
						</span>
					</div>
				))}

				{images.length < 4 && (
					<label
						htmlFor="image"
						className="flex justify-center items-center flex-col h-[200px] cursor-pointer border-dashed border-2 border-slate-700 rounded-md hover:border-red-500 bg-slate-100 w-full">
						<Images />
						<span> Add Images</span>
					</label>
				)}
				<input onChange={imageHandle} multiple type="file" className="hidden" id="image" />
			</div>

			<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
				<TextInput
					control={form.control}
					name="name"
					label="Product Name *"
					placeholder="Enter Product name"
					type="text"
					required={true}
				/>
				<WeightInput form={form} />
			</div>
		</div>
	);
}
