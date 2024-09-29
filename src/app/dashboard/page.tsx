import { Sidebar } from '@/components/sidebar';
import DragDropDocumentSystem from '@/components/drag-and-drop-document-system';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user?.id) {
    return <div>Please log in to access the dashboard.</div>;
  }

  const { data: docsData, error: docsError } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('user_id', authData.user.id)
    .order('upload_date', { ascending: false });

  const { data: foldersData, error: foldersError } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', authData.user.id);

  if (docsError || foldersError) {
    console.error('Error fetching data:', docsError || foldersError);
    return <div>Error loading dashboard data. Please try again later.</div>;
  }

  return (
    <div className='flex h-screen'>
      <Sidebar />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 overflow-x-hidden overflow-y-auto'>
          <DragDropDocumentSystem
            initialDocuments={docsData || []}
            initialFolders={foldersData || []}
          />
        </main>
      </div>
    </div>
  );
}
