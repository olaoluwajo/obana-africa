import { create } from "zustand";

interface OtpStore {
	otp: string | null;
	token: string | null;
	setOtp: (otp: string) => void;
	setToken: (token: string) => void;
	clearOtp: () => void;
	clearToken: () => void;
}

export const useOtpStore = create<OtpStore>((set) => ({
	otp: null,
	token: null,
	setOtp: (otp) => set({ otp }),
	setToken: (token) => set({ token }),
	clearOtp: () => set({ otp: null }),
	clearToken: () => set({ token: null }),
}));


