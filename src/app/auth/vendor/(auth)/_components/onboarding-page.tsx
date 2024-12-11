import Link from "next/link";
import React from "react";

const OnboardingPage = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-between py-8 bg-gradient-to-b from-[#fff] to-[#7fdbd4]  ">
			<div className="flex flex-col justify-center items-center w-full h-[80vh]">
				<div className="flex flex-col justify-center items-center w-full">
					<img src="/logo.png" alt="" className=" mb-2 md:w-[20%] w-[50%]" />
					<p className="text-lg my-4 ">
						Please Login if you already have an account & Register if you dont have an account
					</p>
					<p className="text-sm"> </p>
				</div>
				<div className="flex mt-8">
					<Link href="/sign-in">
						<button className="bg-[#1b3b5f] hover:bg-[#3874b8] text-white py-12 px-16  text-xl font-semibold">
							LOGIN
						</button>
					</Link>

					<Link href="/sign-up">
						<button className="bg-[#2b6e64] hover:bg-[#3874b8]  text-white py-12 px-16  text-xl font-semibold">
							REGISTER
						</button>
					</Link>
				</div>
			</div>

			<footer className="mt-16 text-sm">&copy; 2024 obana.africa</footer>
		</div>
	);
};

export default OnboardingPage;
