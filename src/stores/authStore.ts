import {create} from "zustand";

type AuthState = {
	isAuthenticated: boolean;
	setAuthenticated: (authenticated: boolean) => void;
};

const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated:
		typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true",
	setAuthenticated: (authenticated) => {
		set({ isAuthenticated: authenticated });
		if (typeof window !== "undefined") {
			localStorage.setItem("isAuthenticated", String(authenticated));
		}
	},
}));

export default useAuthStore;
