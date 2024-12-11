

"use client";
import React, { useState } from "react";
import OnboardingModal from "@/components/modals/OnboardingModal";
import VendorSignUp from "./_components/VendorSignUp";

export default function VendorSignUpPage() {
	const [isModalOpen, setIsModalOpen] = useState(true);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<OnboardingModal isOpen={isModalOpen} onClose={closeModal} />

			<VendorSignUp />
		</>
	);
}
