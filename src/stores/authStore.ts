import { create } from "zustand";
import Cookies from "js-cookie";

type AuthState = {
	isAuthenticated: boolean;
	role: any | null;
	setRole: (role: any) => void;
	setAuthenticated: (authenticated: boolean, token?: string, role?: any) => void;
	lastActivityTime: number | null;
	resetLastActivityTime: () => void;
	clearAuth: () => void;
};

const TIMEOUT_LIMIT = 7 * 24 * 60 * 60 * 1000;

const useAuthStore = create<AuthState>((set) => ({
	isAuthenticated: typeof window !== "undefined" && Cookies.get("otpToken") !== undefined,
	role: Cookies.get("role") || null,
	setRole: (role) => set({ role }),
	lastActivityTime:
		typeof window !== "undefined" ? parseInt(Cookies.get("lastActivityTime") || "0") : null,
	setAuthenticated: (authenticated, token, role) => {
		console.log("Setting authenticated state:", { authenticated, token, role });
		set({ isAuthenticated: authenticated, role: role || null });
		if (typeof window !== "undefined") {
			localStorage.setItem("isAuthenticated", String(authenticated));
			Cookies.set("isAuthenticated", String(authenticated));
			if (role) {
				localStorage.setItem("role", role);
				Cookies.set("role", role, { expires: 1 });
			}
		}
		if (authenticated && token) {
			const currentTime = Date.now();
			localStorage.setItem("otpToken", token);
			localStorage.setItem("isAuthenticated", "true");
			localStorage.setItem("lastActivityTime", String(currentTime));
			Cookies.set("otpToken", token, { expires: 1 });
			Cookies.set("isAuthenticated", "true");
			Cookies.set("lastActivityTime", String(currentTime), { expires: 1 });
			set({ lastActivityTime: currentTime });
		} else {
			localStorage.removeItem("lastActivityTime");
			Cookies.remove("lastActivityTime");
		}
	},
	resetLastActivityTime: () => {
		if (typeof window !== "undefined") {
			const currentTime = Date.now();
			Cookies.set("lastActivityTime", String(currentTime), { expires: 1 });
			set({ lastActivityTime: currentTime });
		}
	},
	clearAuth: () => {
		localStorage.clear();
		set({ isAuthenticated: false, role: null });
		Cookies.remove("isAuthenticated");
		Cookies.remove("otpToken");
		Cookies.remove("role");
		Cookies.remove("lastActivityTime");
	},
}));

// Function to check inactivity
const checkInactivity = () => {
	if (typeof window !== "undefined") {
		const lastActivityTime = parseInt(Cookies.get("lastActivityTime") || "0");
		const currentTime = Date.now();

		if (currentTime - lastActivityTime > TIMEOUT_LIMIT) {
			useAuthStore.getState().setAuthenticated(false);
			console.log("User logged out due to inactivity.");
		}
	}
};

// Automatically check for inactivity every 5 minutes (300000 ms)
setInterval(checkInactivity, 50 * 60 * 1000);

export default useAuthStore;
