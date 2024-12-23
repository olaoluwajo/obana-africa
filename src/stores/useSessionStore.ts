import { create } from "zustand";
import { persist } from "zustand/middleware";

const localStorageWrapper = {
	getItem: (name: string) => {
		const item = localStorage.getItem(name);
		return item ? JSON.parse(item) : null;
	},
	setItem: (name: string, value: any) => {
		localStorage.setItem(name, JSON.stringify(value));
	},
	removeItem: (name: string) => {
		localStorage.removeItem(name);
	},
};

type Session = {
	firstName: string;
	lastName: string;
	vendorEmail: string;
	initials: string;
	setSession: (session: { user: { name: string; email: string } }) => void;
	clearSession: () => void;
};

const useSessionStore = create<Session>()(
	persist(
		(set) => ({
			firstName: "",
			lastName: "",
			vendorEmail: "",
			initials: "",

			setSession: (session) => {
				const nameParts = session.user.name.split(" ");
				const firstName = nameParts[0] || "";
				const lastName = nameParts[1] || "";
				const initials = firstName.charAt(0) + lastName.charAt(0);

				set({
					firstName,
					lastName,
					vendorEmail: session.user.email,
					initials: initials.toUpperCase(),
				});
			},

			clearSession: () => {
				set({
					firstName: "",
					lastName: "",
					vendorEmail: "",
					initials: "",
				});
			},
		}),
		{
			name: "session-storage",
			storage: localStorageWrapper, 
		},
	),
);

export default useSessionStore;
