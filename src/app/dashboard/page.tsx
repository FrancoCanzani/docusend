import { Sidebar } from '@/components/sidebar';
import { Dashboard } from '@/components/dashboard';

export default function DashboardPage() {
  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100'>
          <Dashboard />
        </main>
      </div>
    </div>
  );
}
