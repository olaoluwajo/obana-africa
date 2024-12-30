import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import SizeSelector from "../inputs/size-selector";
import AvailableColorsInput from "../inputs/available-color-input";
import { TextInput } from "../inputs/text-input";
import SelectInput from "../inputs/select-input";
import { brandOptions, manufacturerOptions, unitOptions, unitPerBoxOptions } from "@/constants/optionsData";
import { Textarea } from "@/components/ui/textarea";

const ProductIdentifiers = ({ form }: any) => (
	<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
		<TextInput
			control={form.control}
			name="productCode"
			label="Product Code(vendor) *"
			placeholder="Enter your Product code"
			type="text"
			required={true}
		/>
		<TextInput
			control={form.control}
			name="sku"
			label="Product Code(obana) *"
			placeholder="Generated SKU"
			type="text"
			value={form.watch("sku")}
			required={true}
			disabled={true}
			tooltipContent="The Stock Keeping Unit of the item"
		/>
		<div className="grid grid-cols-2 gap-6 md:grid-cols-2">
			<SelectInput
				control={form.control}
				name="unit"
				label="Unit of Measurement"
				disabled={true}
				options={unitOptions}
				placeholder="Select Unit..."
			/>
			<SelectInput
				control={form.control}
				name="unitPerBox"
				label="Unit Per Box"
				options={unitPerBoxOptions}
				placeholder="Select Unit Per Box"
			/>
		</div>
	</div>
);

// Product Size and Color Component
const ProductSizeAndColor = ({ form }: any) => (
	<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
		<SizeSelector
			onValuesChange={(type, sizes) => {
				form.setValue("sizeType", type);
				form.setValue("sizesRun", sizes.join(", "));
			}}
			tooltipContent="Select your product size type and the size ranges"
		/>
		<AvailableColorsInput
			onChange={(value) => form.setValue("availableColors", value)}
			tooltipContent="Select your product available colors or enter your custom mixed colors"
		/>
	</div>
);

// Product Manufacturing Info Component
const ProductManufacturingInfo = ({ form, handleBrandChange }: any) => (
	<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
		<TextInput
			control={form.control}
			name="countryOfManufacture"
			label="Country of Manufacture"
			placeholder="Enter country of manufacture"
			type="text"
		/>
		{/* <SelectInput
			control={form.control}
			name="manufacturer"
			label="Manufacturer"
			options={manufacturerOptions}
			placeholder="Select Manufacturer..."
			tooltipContent="Select your product manufacturer"
		/> */}
		<SelectInput
			control={form.control}
			name="brand"
			label="Brand *"
			options={brandOptions}
			required={true}
			placeholder="Select Brand..."
			onChange={handleBrandChange}
			tooltipContent="Select your product Brand"
		/>
	</div>
);

// Product Codes Component
const ProductCodes = ({ form }: any) => (
	<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
			<TextInput
				control={form.control}
				name="isbn"
				label="ISBN"
				placeholder="Enter ISBN"
				type="number"
				tooltipContent="Thirteen digit unique commercial book identifier"
			/>
			<TextInput
				control={form.control}
				name="upc"
				label="UPC"
				placeholder="Enter UPC"
				type="number"
				tooltipContent="Twelve digit unique number associated with the bar code"
			/>
		</div>
		<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
			<TextInput
				control={form.control}
				name="mpn"
				label="MPN"
				placeholder="Enter MPN"
				type="number"
				tooltipContent="Manufacturing Part Number identifies a part design"
			/>
			<TextInput
				control={form.control}
				name="ean"
				label="EAN"
				placeholder="Enter EAN"
				type="number"
				tooltipContent="Thirteen digit unique number (International Article Number)"
			/>
		</div>
	</div>
);

// Product Description Component
const ProductDescription = ({ form }: any) => (
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

export {
	ProductIdentifiers,
	ProductSizeAndColor,
	ProductManufacturingInfo,
	ProductCodes,
	ProductDescription,
};
