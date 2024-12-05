// import {create} from "zustand";

// type AuthState = {
// 	isAuthenticated: boolean;
// 	setAuthenticated: (authenticated: boolean) => void;
// };

// const useAuthStore = create<AuthState>((set) => ({
// 	isAuthenticated:
// 		typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true",
// 	setAuthenticated: (authenticated) => {
// 		set({ isAuthenticated: authenticated });
// 		if (typeof window !== "undefined") {
// 			localStorage.setItem("isAuthenticated", String(authenticated));
// 		}
// 	},
// }));

// export default useAuthStore;

import { create } from "zustand";

type AuthState = {
	isAuthenticated: boolean;
	setAuthenticated: (authenticated: boolean) => void;
	lastActivityTime: number | null;
	resetLastActivityTime: () => void;
};

// 8 hours in milliseconds
const TIMEOUT_LIMIT = 3 * 60 * 60 * 1000;

const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated:
		typeof window !== "undefined" && localStorage.getItem("isAuthenticated") === "true",
	lastActivityTime:
		typeof window !== "undefined"
			? parseInt(localStorage.getItem("lastActivityTime") || "0")
			: null,
	setAuthenticated: (authenticated) => {
		set({ isAuthenticated: authenticated });
		if (typeof window !== "undefined") {
			localStorage.setItem("isAuthenticated", String(authenticated));
			// Reset the last activity time if authentication changes
			if (authenticated) {
				const currentTime = Date.now();
				localStorage.setItem("lastActivityTime", String(currentTime));
				set({ lastActivityTime: currentTime });
			} else {
				localStorage.removeItem("isAuthenticated");
				localStorage.removeItem("lastActivityTime");
			}
		}
	},
	resetLastActivityTime: () => {
		if (typeof window !== "undefined") {
			const currentTime = Date.now();
			localStorage.setItem("lastActivityTime", String(currentTime));
			set({ lastActivityTime: currentTime });
		}
	},
}));

// Function to check inactivity
const checkInactivity = () => {
	if (typeof window !== "undefined") {
		const lastActivityTime = parseInt(localStorage.getItem("lastActivityTime") || "0");
		const currentTime = Date.now();

		// If more than 8 hours have passed since the last activity
		if (currentTime - lastActivityTime > TIMEOUT_LIMIT) {
			useAuthStore.getState().setAuthenticated(false); // Log the user out
			console.log("User logged out due to inactivity.");
		}
	}
};

// Automatically check for inactivity every 5 minutes (300000 ms)
setInterval(checkInactivity, 5 * 60 * 1000);

export default useAuthStore;
