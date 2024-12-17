import { Loader } from "lucide-react";
// import { lazy, Suspense } from "react";
import dynamic from "next/dynamic";

const LazyOverviewPage = dynamic(() => import("./_components/overview"), {
	loading: () => <Loader />,
});

// const LazyOverviewPage = lazy(() => import("./_components/overview"));

export const metadata = {
	title: "Dashboard : Overview",
};

export default function page() {
	return (
		// <Suspense>
		<LazyOverviewPage />
		// </Suspense>
	);
}
