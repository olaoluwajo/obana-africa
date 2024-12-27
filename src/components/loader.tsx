import React from "react";

export default function Loader({
	message = "Loading...",
	showMessage = true,
	className = "",
	fullscreen = true,
}) {
	return (
		<div
			className={`${
				fullscreen ? "fixed inset-5 bg-white/80" : "flex justify-center items-center"
			} flex flex-col items-center ${className}`}>
			<div
				className="inline-block h-12 w-12 animate-[spin_0.7s_linear_infinite] rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
				role="status">
				<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
					Loading...
				</span>
			</div>

			{showMessage && <p className="mt-4 text-gray-700 font-medium text-lg">{message}</p>}
		</div>
	);
}
