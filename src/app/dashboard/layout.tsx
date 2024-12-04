import KBar from '@/components/kbar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import ProtectedRoute from '@/components/protected-routes';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

export const metadata: Metadata = {
	title: "Dashbaord Overview",
	description: "Vendor dashboard",
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  // Persisting the sidebar state in the cookie.
  const cookieStore = cookies();
  const defaultOpen = cookieStore.get('sidebar:state')?.value === 'true';
	return (
		<ProtectedRoute>
			<KBar>
				<SidebarProvider defaultOpen={defaultOpen}>
					<AppSidebar />
					<SidebarInset>
          <Header />
          {/* page main content */}
          {children}
          {/* page main content ends */}
        </SidebarInset>
      </SidebarProvider>
			</KBar>
		</ProtectedRoute>
	);
}
