// import { auth } from 'google-auth-library';
// import { redirect } from 'next/navigation';

// export default async function Dashboard() {
//   const session = await auth();

//   if (!session?.user) {
//     return redirect('/');
//   } else {
//     redirect('/dashboard/overview');
//   }
// }

import React from "react";
import OverViewPage from "./overview/_components/overview";

const Dashboard = () => {
	return <OverViewPage />;

	// <OverViewPage />;;
};

export default Dashboard;
