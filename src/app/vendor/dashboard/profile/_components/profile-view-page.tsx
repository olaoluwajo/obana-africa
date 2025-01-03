"use client";
import PageContainer from "@/components/layout/page-container";
import { useEffect, useState } from "react";
import VendorProfileView from "./profile-view-helper";
import Loader from "@/components/loader";

export default function ProfileViewPage() {
	const [vendorDetails, setVendorDetails] = useState(null);
	const [error, setError] = useState<string | null>(null);
	useEffect(() => {
		const vendorId = localStorage.getItem("vendorId");
		if (!vendorId) {
			setError("Vendor ID not found in localStorage.");
			return;
		}

		fetch(`/api/vendors/${vendorId}`)
			.then((res) => {
				if (!res.ok) throw new Error("Failed to fetch vendor details");
				return res.json();
			})
			.then((data) => setVendorDetails(data.contact))
			.catch((err) => setError(err.message));
	}, []);

	if (error) return <div>Error: {error}</div>;
	if (!vendorDetails)
		return (
			<div>
				<Loader message="Checking your profile please wait" fullscreen={false} />
			</div>
		);

	return (
		<PageContainer>
			<VendorProfileView vendorDetails={vendorDetails} />
		</PageContainer>
	);
}
