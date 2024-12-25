import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { FormLabel,FormItem } from "@/components/ui/form";
import { availableColorOptions } from "@/constants/optionsData";
import * as Tooltip from "@radix-ui/react-tooltip";
import { MessageCircleQuestion } from "lucide-react";

interface AvailableColorsInputProps {
	onChange: (value: string) => void;
	tooltipContent?: string;
}

const AvailableColorsInput: React.FC<AvailableColorsInputProps> = ({
	onChange,
	tooltipContent,
}) => {
	const [selectedColors, setSelectedColors] = useState<string[]>([]);
	const [customColor, setCustomColor] = useState<string>("");
	const [isMixed, setIsMixed] = useState<boolean>(false);

	// const colorOptions = ["Red", "Blue", "Green", "Yellow", "Black", "White", "Mixed Colors"];

	const handleSelectColor = (color: string) => {
		if (color === "Mixed Colors") {
			setIsMixed(true);
			setSelectedColors([]);
		} else {
			setIsMixed(false);
			if (!selectedColors.includes(color)) {
				setSelectedColors((prev) => [...prev, color]);
			}
		}
	};

	const handleRemoveColor = (color: string) => {
		setSelectedColors((prev) => prev.filter((c) => c !== color));
	};

	const formatColors = (): string => {
		if (isMixed) {
			return customColor.trim();
		}
		return selectedColors.join(", ");
	};

	// Update the parent input field
	useEffect(() => {
		onChange(formatColors());
	}, [selectedColors, customColor, isMixed, onChange]);

	return (
		<div>
			<FormItem>
				<FormLabel>Available Colors</FormLabel>{" "}
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
				<Select onValueChange={handleSelectColor}>
					<SelectTrigger>
						<SelectValue placeholder="Select colors" />
					</SelectTrigger>
					<SelectContent className="max-h-[250px] overflow-y-scroll max-w-[200px] z-10">
						{availableColorOptions.map((color) => (
							<SelectItem key={color} value={color}>
								{color}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{/* Display selected colors */}
				{!isMixed && (
					<div className="flex flex-wrap gap-2 mt-2">
						{selectedColors.map((color) => (
							<div
								key={color}
								className="px-2 py-1 bg-gray-200 rounded-full text-xs flex items-center space-x-2">
								<span>{color}</span>
								<button
									type="button"
									className="text-red-500"
									onClick={() => handleRemoveColor(color)}>
									×
								</button>
							</div>
						))}
					</div>
				)}
				{/* Custom color input for Mixed Colors */}
				{isMixed && (
					<div className="mt-2">
						<Input
							type="text"
							placeholder="Enter custom colors"
							value={customColor}
							onChange={(e) => setCustomColor(e.target.value)}
						/>
					</div>
				)}
			</FormItem>
		</div>
	);
};

export default AvailableColorsInput;
