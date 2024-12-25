import { FormControl, FormField, FormMessage, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

const DescriptionField = ({ form }: any) => (
	<FormField
		control={form.control}
		name="description"
		render={({ field }) => (
			<FormItem>
				<FormLabel>Description</FormLabel>
				<FormControl>
					<Textarea
						placeholder="Enter product description"
						className="resize-none"
						{...field}
					/>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);

export default DescriptionField;
