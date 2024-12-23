// import React from "react";

// export default function Loader() {
// 	return (
// 		<div >
// 			<div
// 				className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
// 				role="status">
// 				<span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
// 					Loading...
// 				</span>
// 			</div>
// 		</div>
// 	);
// }

import React from "react";

export default function Loader({ message = "Loading...", showMessage = true, className = "" }) {
	return (
		<div
			className={`fixed inset-0 flex flex-col items-center justify-center bg-white/80 ${className}`}>
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
