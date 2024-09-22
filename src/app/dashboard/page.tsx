import { Sidebar } from '@/components/sidebar';
import { Dashboard } from '@/components/dashboard';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();

  const { data: authData } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('user_id', authData.user?.id)
    .order('upload_date', { ascending: false });

  if (error) {
    console.error('Error listing documents:', error);
    return null;
  }

  return (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar documentMetadata={data} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-100'>
          <Dashboard documentMetadata={data} />
        </main>
      </div>
    </div>
  );
}
