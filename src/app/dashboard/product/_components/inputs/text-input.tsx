import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as Tooltip from "@radix-ui/react-tooltip";
import { MessageCircleQuestion } from "lucide-react";

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
}

const TextInput: React.FC<TextInputProps> = ({
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

export default TextInput;
