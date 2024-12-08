import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface CategoryInputProps {
	control: any;
	name: string;
	label: string;
	options: { label: string; value: string }[];
	placeholder: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
	searchPlaceholder?: string;
}

const CategoryInput: React.FC<CategoryInputProps> = ({
	control,
	name,
	label,
	options,
	placeholder,
	disabled = false,
	onChange,
	searchPlaceholder = "Search",
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredOptions, setFilteredOptions] = useState(options);

	// Filter options as the search term changes
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		setFilteredOptions(
			options.filter((option) => option.label.toLowerCase().includes(value.toLowerCase())),
		);
	};

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className="text-red-500">{label} *</FormLabel>
					<Select
						value={field.value}
						onValueChange={(value) => {
							field.onChange(value);
							if (onChange) onChange(value);
						}}
						disabled={disabled}>
						<FormControl>
							<SelectTrigger className="relative w-full">
								<Input
									placeholder={placeholder}
									value={searchTerm}
									onChange={handleSearchChange}
									className={`${
										!field.value ? "absolute w-full top-0 left-0" : "hidden"
									} p-2 border-none bg-transparent z-10`}
								/>
								<SelectValue placeholder={field.value ? undefined : placeholder} />
							</SelectTrigger>
						</FormControl>
						<SelectContent>
							{/* Search input for filtering */}
							<div className="p-2">
								<Input
									placeholder={searchPlaceholder}
									value={searchTerm}
									onChange={handleSearchChange}
									className="mb-2 border border-gray-300 rounded-md p-2"
								/>
							</div>
							{/* Render filtered options */}
							{filteredOptions.map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export default CategoryInput;
