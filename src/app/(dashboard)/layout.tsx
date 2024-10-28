import { Sidebar } from '@/components/sidebar';

export default function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <main className='flex-1 flex flex-col p-4 px-6 w-full overflow-auto'>
        {children}
      </main>
    </div>
  );
}
