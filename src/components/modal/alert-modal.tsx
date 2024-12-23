"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	loading: boolean;
	title: string;
	description: string;
	success?: boolean; // Optional success flag
	cancelLabel?: string; // Custom cancel button label
	confirmLabel?: string; // Custom confirm button label
}

export const AlertModal: React.FC<AlertModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	loading,
	title,
	description,
	success,
	cancelLabel = "Cancel", // Default to 'Cancel'
	confirmLabel = "Continue", // Default to 'Continue'
}) => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<Modal title={title} description={description} isOpen={isOpen} onClose={onClose}>
			<div className="flex w-full items-center justify-end space-x-2 pt-6 ">
				<Button disabled={loading} variant="outline" onClick={onClose}>
					{cancelLabel}
				</Button>
				<Button
					disabled={loading}
					variant={success ? "default" : "destructive"} // Show destructive variant for error case
					onClick={onConfirm}>
					{confirmLabel}
				</Button>
			</div>
		</Modal>
	);
};
