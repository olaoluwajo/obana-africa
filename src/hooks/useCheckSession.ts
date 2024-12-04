"use client";
import { useEffect } from "react";
import useAuthStore from "@/stores/authStore";

const useCheckSession = () => {
	useEffect(() => {
		console.log("Checking session...");

		const token = localStorage.getItem("userToken");
		const email = localStorage.getItem("userEmail");

		if (token && email) {
			console.log("Session found, updating auth state.");
			useAuthStore.getState().setAuthenticated(true);
		} else {
			console.log("No session found, updating auth state to false.");
			useAuthStore.getState().setAuthenticated(false);
		}
	}, []);
};

export default useCheckSession;
