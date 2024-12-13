import { create } from "zustand";
import Cookies from "js-cookie";

interface VendorState {
	vendorId: string | null;
	setVendorId: (id: string) => void;
	clearVendorId: () => void;

	vendorName: string | null;
	setVendorName: (name: string) => void;
	clearVendorName: () => void;
	clearAll: () => void;
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

	vendorName: null,
	setVendorName: (name: string) => {
		set({ vendorName: name });
		Cookies.set("vendorName", name, { expires: 1 });
		localStorage.setItem("vendorName", name);
	},
	clearVendorName: () => {
		Cookies.remove("vendorName");
		localStorage.removeItem("vendorName");
		set({ vendorName: null });
	},
	clearAll: () => {
		Cookies.remove("vendorId");
		Cookies.remove("vendorName");
		localStorage.removeItem("vendorId");
		localStorage.removeItem("vendorName");
		set({ vendorId: null, vendorName: null });
	},
}));
