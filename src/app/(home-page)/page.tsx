"use client";
import { useRouter } from "next/navigation";
	
const Home = () => {
	const router = useRouter();
	router.push("/auth/vendor/sign-in");
	return null;
};

export default Home;
