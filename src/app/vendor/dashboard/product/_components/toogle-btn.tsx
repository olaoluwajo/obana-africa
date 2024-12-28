import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface ItemProps {
	itemId: string;
	initialStatus: string;
}

const ItemToggleButton = ({ itemId, initialStatus }: ItemProps) => {
	const [status, setStatus] = useState(initialStatus);
	const [loading, setLoading] = useState(false);
	const router = useRouter();

	console.log("status", status);

	const toggleItemStatus = async () => {
		setLoading(true);

		try {
			const response = await axios.post("/api/toggle-status", {
				itemId,
				currentStatus: status,
			});

			if (response.data.success) {
				// Toggle between "active" and "inactive"
				setStatus((prevStatus) => (prevStatus === "active" ? "inactive" : "active"));
				 window.location.reload();
				router.push(window.location.pathname);
				router.refresh();
			} else {
				console.error("Failed to toggle item status:", response.data.message);
			}
		} catch (error) {
			console.error("Error:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<button
			onClick={toggleItemStatus}
			disabled={loading}
			className={`px-4 py-2 text-white rounded ${
				status === "active" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
			}`}>
			{loading ? "Processing..." : status === "active" ? "Set Inactive" : "Set Active"}
		</button>
	);
};

export default ItemToggleButton;
