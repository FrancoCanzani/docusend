import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex-1 flex flex-col py-4 px-6 w-full overflow-auto'>
        {children}
      </main>
    </SidebarProvider>
  );
}
