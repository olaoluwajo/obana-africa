"use client";
import { useRouter } from "next/navigation";

const Page = () => {
	const router = useRouter();
	router.push("/auth/vendor/sign-in");
	return null;
};

export default Page;
