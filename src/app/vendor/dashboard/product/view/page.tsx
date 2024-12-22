"use client";
import { useRouter } from "next/navigation";

const Page = () => {
	const router = useRouter();
	router.push("/vendor/dashboard/product");
	return null;
};

export default Page;