import { FileUploader } from "@/components/file-uploader";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

const ImageUpload = ({ images, setImages, isLoading }: any) => (
	<FormField
		name="image"
		render={({ field }) => (
			<div className="space-y-6">
				<FormItem className="w-full">
					<FormLabel>Images</FormLabel>
					<FormControl>
						<FileUploader
							value={images}
							onValueChange={(files) => setImages(files)}
							maxFiles={8}
							maxSize={4 * 1024 * 1024}
							disabled={isLoading}
						/>
					</FormControl>
					<Separator />
					<FormMessage />
				</FormItem>
			</div>
		)}
	/>
);

export default ImageUpload;
