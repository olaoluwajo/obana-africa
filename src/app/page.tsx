"use client";
import React, { useState } from "react";
import VendorSignUpPage from "./vendor-sign-up/page";
import OnboardingModal from "../components/modals/OnboardingModal";

export default function Home() {
	const [isModalOpen, setIsModalOpen] = useState(true);

	const closeModal = () => {
		setIsModalOpen(false);
	};

	return (
		<>
			<OnboardingModal isOpen={isModalOpen} onClose={closeModal} />

			<VendorSignUpPage />
		</>
	);
}
