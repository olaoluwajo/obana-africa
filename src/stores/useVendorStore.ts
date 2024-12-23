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

	vendorFirstName: string | null;
	setVendorFirstName: (name: string) => void;
	clearVendorFirstName: () => void;

	vendorLastName: string | null;
	setVendorLastName: (name: string) => void;
	clearVendorLastName: () => void;

	vendorEmail: string | null;
	setVendorEmail: (name: string) => void;
	clearVendorEmail: () => void;
}

const setPersistedState = (key: string, value: string | null) => {
	if (value) {
		Cookies.set(key, value, { expires: 1 });
		localStorage.setItem(key, value);
	} else {
		Cookies.remove(key);
		localStorage.removeItem(key);
	}
};

export const useVendorStore = create<VendorState>((set) => ({

	vendorId: null,
	setVendorId: (id) => {
		set({ vendorId: id });
		setPersistedState("vendorId", id);
	},
	clearVendorId: () => {
		set({ vendorId: null });
		setPersistedState("vendorId", null);
	},

	vendorName: null,
	setVendorName: (name: string) => {
		set({ vendorName: name });
		setPersistedState("vendorName", name);
	},
	clearVendorName: () => {
		setPersistedState("vendorName", null);
		set({ vendorName: null });
	},

	vendorFirstName: null,
	setVendorFirstName: (firstName: string) => {
		set({ vendorFirstName: firstName });
		Cookies.set("vendorFirstName", firstName, { expires: 1 });
		localStorage.setItem("vendorFirstName", firstName);
	},
	clearVendorFirstName: () => {
		Cookies.remove("vendorFirstName");
		localStorage.removeItem("vendorFirstName");
		set({ vendorFirstName: null });
	},

	vendorLastName: null,
	setVendorLastName: (lastName: string) => {
		set({ vendorLastName: lastName });
		Cookies.set("vendorLastName", lastName, { expires: 1 });
		localStorage.setItem("vendorLastName", lastName);
	},
	clearVendorLastName: () => {
		Cookies.remove("vendorLastName");
		localStorage.removeItem("vendorLastName");
		set({ vendorLastName: null });
	},

	vendorEmail: null,
	setVendorEmail: (email: string) => {
		set({ vendorEmail: email });
		Cookies.set("vendorEmail", email, { expires: 1 });
		localStorage.setItem("vendorEmail", email);
	},
	clearVendorEmail: () => {
		Cookies.remove("vendorEmail");
		localStorage.removeItem("vendorEmail");
		set({ vendorEmail: null });
	},

	clearAll: () => {
		const keys = ["vendorId", "vendorName", "vendorFirstName", "vendorLastName", "vendorEmail"];
		keys.forEach((key) => {
			Cookies.remove(key);
			localStorage.removeItem(key);
		});
		set({
			vendorId: null,
			vendorName: null,
			vendorFirstName: null,
			vendorLastName: null,
			vendorEmail: null,
		});
	},
}));
