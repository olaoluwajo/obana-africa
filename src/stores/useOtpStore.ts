import { create } from "zustand";

interface OtpStore {
	otp: string | null;
	token: string | null;
	role: string | null;
	setOtp: (otp: string) => void;
	setToken: (token: string) => void;
	setRole: (role: string) => void;
	clearOtp: () => void;
	clearToken: () => void;
}

export const useOtpStore = create<OtpStore>((set) => ({
	otp: null,
	token: null,
	role: null,
	setOtp: (otp) => set({ otp }),
	setToken: (token) => set({ token }),
	setRole: (role) => set({ role }),
	clearOtp: () => set({ otp: null }),
	clearToken: () => set({ token: null }),
}));
