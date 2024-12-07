import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface SelectInputProps {
	control: any;
	name: string;
	label: string;
	options: string[];
	placeholder: string;
	disabled?: boolean;
	onChange?: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({
	control,
	name,
	label,
	options,
	placeholder,
	disabled,
	onChange,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredOptions, setFilteredOptions] = useState(options);

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setSearchTerm(value);
		setFilteredOptions(
			options.filter((option) => option.toLowerCase().includes(value.toLowerCase())),
		);
	};

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{label}</FormLabel>
					<Select
						value={field.value}
						onValueChange={(value) => {
							field.onChange(value);
							if (onChange) onChange(value);
						}}>
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
						<FormControl></FormControl>
						<SelectContent className="max-h-[300px] overflow-y-scroll max-w-[250px] z-10">
							<div className="p-2">
								<Input
									placeholder="Search"
									value={searchTerm}
									onChange={handleSearchChange}
									className="mb-2 border border-gray-300 rounded-md p-2"
								/>
							</div>
							{filteredOptions.map((option) => (
								<SelectItem key={option} value={option}>
									{option}
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

export default SelectInput;

