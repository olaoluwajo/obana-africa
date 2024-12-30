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
import * as Tooltip from "@radix-ui/react-tooltip";
import { MessageCircleQuestion } from "lucide-react";

interface SelectInputProps {
	control: any;
	name: string;
	label: string;
	options: string[];
	placeholder: string;
	tooltipContent?: string;
	disabled?: boolean;
	required?: boolean;
	onChange?: (value: string) => void;
}

const SelectInput: React.FC<SelectInputProps> = ({
	control,
	name,
	label,
	options,
	placeholder,
	tooltipContent,
	disabled = false,
	onChange,
	required = false,
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
					<FormLabel className={`${required ? "text-red-500" : ""}`}>{label}</FormLabel>
					{tooltipContent && (
						<Tooltip.Root>
							<Tooltip.Trigger>
								<MessageCircleQuestion size={12} className="text-black/40 mr-2" />
							</Tooltip.Trigger>
							<Tooltip.Content
								side="top"
								sideOffset={2}
								className="bg-black/80 text-white px-2 py-1 rounded-md text-xs max-w-[200px]">
								{tooltipContent}
								<Tooltip.Arrow className="fill-black/80" />
							</Tooltip.Content>
						</Tooltip.Root>
					)}
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
								disabled={disabled}
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
