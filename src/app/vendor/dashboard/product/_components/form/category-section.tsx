import { fabricTypeOptions } from "@/constants/optionsData";
import SelectInput from "../inputs/select-input";
import CategoryInput from "../inputs/category-input";
import { categoryOptions } from "@/constants/categoryData";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export const ProductCategorySection = ({
	form,
	selectedCategory,
	selectedSubCategory,
	selectedSubSubCategory,
	handleCategoryChange,
	handleSubCategoryChange,
	handleSubSubCategoryChange,
	availableSubCategories,
	availableSubSubCategories,
	productId,
}: any) => (
	<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
		<SelectInput
			control={form.control}
			name="fabricType"
			label="Fabric Type"
			options={fabricTypeOptions}
			placeholder="Select fabric type"
		/>

		<CategorySelect form={form} handleChange={handleCategoryChange} options={categoryOptions} />

		{productId === "new" ? (
			<NewProductCategories
				form={form}
				selectedCategory={selectedCategory}
				selectedSubCategory={selectedSubCategory}
				handleSubCategoryChange={handleSubCategoryChange}
				handleSubSubCategoryChange={handleSubSubCategoryChange}
				availableSubCategories={availableSubCategories}
				availableSubSubCategories={availableSubSubCategories}
			/>
		) : (
			<ExistingProductCategories
				form={form}
				selectedSubCategory={selectedSubCategory}
				selectedSubSubCategory={selectedSubSubCategory}
				handleSubCategoryChange={handleSubCategoryChange}
				handleSubSubCategoryChange={handleSubSubCategoryChange}
				availableSubCategories={availableSubCategories}
				availableSubSubCategories={availableSubSubCategories}
			/>
		)}
	</div>
);

// Category Select Component
const CategorySelect = ({ form, handleChange, options }: any) => (
	<FormField
		control={form.control}
		name="category"
		render={({ field }) => (
			<CategoryInput
				control={form.control}
				name="category"
				label="Category"
				options={options}
				placeholder="Select category"
				onChange={(value) => {
					handleChange(value);
					field.onChange(value);
				}}
			/>
		)}
	/>
);

const NewProductCategories = ({
	form,
	selectedCategory,
	selectedSubCategory,
	handleSubCategoryChange,
	handleSubSubCategoryChange,
	availableSubCategories,
	availableSubSubCategories,
}: any) => (
	<>
		{selectedCategory && (
			<FormField
				control={form.control}
				name="subCategory"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Sub Category</FormLabel>
						<Select
							value={selectedSubCategory}
							onValueChange={(value) => {
								handleSubCategoryChange(value);
								field.onChange(value);
							}}
							disabled={!selectedCategory}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select Sub Category" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{availableSubCategories.map((subCategory: any) => (
									<SelectItem key={subCategory} value={subCategory}>
										{subCategory}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		)}
		{selectedSubCategory && (
			<FormField
				control={form.control}
				name="subSubCategory"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Sub Sub-Category</FormLabel>
						<Select
							value={field.value}
							onValueChange={(value) => {
								handleSubSubCategoryChange(value);
								field.onChange(value);
							}}
							disabled={!selectedSubCategory}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="Select Sub Sub-Category" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								{availableSubSubCategories.map((subSubCategory: any) => (
									<SelectItem key={subSubCategory} value={subSubCategory}>
										{subSubCategory}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		)}
	</>
);

// Existing Product Categories Component
const ExistingProductCategories = ({
	form,
	selectedSubCategory,
	selectedSubSubCategory,
	handleSubCategoryChange,
	handleSubSubCategoryChange,
	availableSubCategories,
	availableSubSubCategories,
}: any) => (
	<>
		<FormField
			control={form.control}
			name="subCategory"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Sub Category</FormLabel>
					<Select
						value={selectedSubCategory}
						onValueChange={(value) => {
							handleSubCategoryChange(value);
							field.onChange(value);
						}}>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder="Select Sub Category" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{availableSubCategories.map((subCategory: any) => (
								<SelectItem key={subCategory} value={subCategory}>
									{subCategory}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
		<FormField
			control={form.control}
			name="subSubCategory"
			render={({ field }) => (
				<FormItem>
					<FormLabel>Sub Sub-Category</FormLabel>
					<Select
						value={selectedSubSubCategory}
						onValueChange={(value) => {
							handleSubSubCategoryChange(value);
							field.onChange(value);
						}}>
						<FormControl>
							<SelectTrigger>
								<SelectValue placeholder="Select Sub Sub-Category" />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{availableSubSubCategories.map((subSubCategory: any) => (
								<SelectItem key={subSubCategory} value={subSubCategory}>
									{subSubCategory}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	</>
);

export { CategorySelect, NewProductCategories, ExistingProductCategories };
