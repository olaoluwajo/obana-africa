"use client";

import React, { Suspense } from "react";
import SignInViewPage from "../_components/sigin-view";

const SignInPage = () => {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<SignInViewPage />
		</Suspense>
	);
};

export default SignInPage;
