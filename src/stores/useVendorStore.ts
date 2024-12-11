import { create } from "zustand";
import Cookies from "js-cookie";

interface VendorState {
	vendorId: string | null;
	setVendorId: (id: string) => void;
	clearVendorId: () => void;
}

export const useVendorStore = create<VendorState>((set) => ({
	vendorId: null,
	setVendorId: (id: string) => {
		set({ vendorId: id });
		Cookies.set("vendorId", id, { expires: 1 });
		localStorage.setItem("vendorId", id);
		console.log("Vendor ID set to:", id);
	},
	clearVendorId: () => {
		Cookies.remove("vendorId");
		localStorage.removeItem("vendorId");
		set({ vendorId: null });
	},
}));
