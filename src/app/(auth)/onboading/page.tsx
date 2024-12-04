import Link from "next/link";
import React from "react";

const OnboardingPage = () => {
	return (
		<div className="min-h-screen flex flex-col items-center justify-between py-8 bg-gradient-to-b from-slate-50 to-blue-500 ">
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
						<button className="bg-indigo-900 hover:bg-indigo-800 text-white py-12 px-16  text-xl font-semibold">
							LOGIN
						</button>
					</Link>

					<Link href="/sign-up">
						<button className="bg-blue-600 hover:bg-blue-500 text-white py-12 px-16  text-xl font-semibold">
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
