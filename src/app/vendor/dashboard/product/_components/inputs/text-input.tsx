import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as Tooltip from "@radix-ui/react-tooltip";
import { MessageCircleQuestion } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

interface TextInputProps {
	control: any;
	name: string;
	label: string;
	placeholder: string;
	type?: string;
	tooltipContent?: string;
	step?: string;
	onChange?: (value: any) => void;
	disabled?: boolean;
	required?: boolean;
	value?: any;
}

export const TextInput: React.FC<TextInputProps> = ({
	control,
	name,
	label,
	placeholder,
	type = "text",
	tooltipContent,
	step,
	onChange,
	required = false,
	disabled = false,
}) => {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					<FormLabel className={`${required ? "text-red-500" : ""}`}>{label}</FormLabel>
					<FormControl>
						{tooltipContent && (
							<Tooltip.Root>
								<Tooltip.Trigger>
									<MessageCircleQuestion size={12} className="text-black/40 mr-2" />
								</Tooltip.Trigger>
								<Tooltip.Content
									side="right"
									sideOffset={10}
									className="bg-black/80 text-white px-2 py-1 rounded-md text-xs max-w-[200px]">
									{tooltipContent}
									<Tooltip.Arrow className="fill-black/80" />
								</Tooltip.Content>
							</Tooltip.Root>
						)}
					</FormControl>
					<Input
						type={type}
						placeholder={placeholder}
						{...field}
						step={step}
						onChange={(e) => {
							field.onChange(e);
							if (onChange) onChange(e);
						}}
						disabled={disabled}
					/>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

export const WeightInput = ({ form }: any) => (
	<FormField
		control={form.control}
		name="weight"
		render={({ field }) => (
			<FormItem>
				<FormLabel>Weight</FormLabel>
				<FormControl>
					<div className="relative">
						<Input
							type="number"
							placeholder="Enter weight"
							value={field.value || ""}
							disabled
							onChange={(e) => field.onChange(e.target.value)}
							className="w-full pr-16"
						/>
						<div className="absolute right-0 top-1/2 transform -translate-y-1/2">
							<WeightUnitSelect form={form} />
						</div>
					</div>
				</FormControl>
				<FormMessage />
			</FormItem>
		)}
	/>
);

export const WeightUnitSelect = ({ form }: any) => (
	<FormField
		control={form.control}
		name="weight_unit"
		render={({ field }) => (
			<Select value={field.value} disabled onValueChange={field.onChange}>
				<SelectTrigger className="border-none bg-slate-200">
					<SelectValue placeholder="Unit" />
				</SelectTrigger>
				<SelectContent>
					{["kg", "g", "lb", "oz"].map((unit) => (
						<SelectItem key={unit} value={unit}>
							{unit}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		)}
	/>
);

// export default TextInput;
