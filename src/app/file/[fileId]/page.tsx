import { createClient } from '@/lib/supabase/server';
import FileMetadata from '@/components/file-metadata';
import { Sidebar } from '@/components/sidebar';
import FileFeedback from '@/components/file-feedback';

export default async function Page({ params }: { params: { fileId: string } }) {
  const { fileId } = params;
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { data: fileMetadata } = await supabase
    .from('file_metadata')
    .select('*')
    .eq('file_id', fileId)
    .eq('user_id', authData.user?.id)
    .single();

  const { data: fileViews } = await supabase
    .from('file_views')
    .select('*')
    .eq('file_id', fileId);

  const { data: fileFeedback } = await supabase
    .from('file_feedback')
    .select('*')
    .eq('file_id', fileId);

  console.log(fileMetadata);
  console.log(fileViews);
  console.log(fileFeedback);

  return (
    <div className='flex h-screen bg-gray-100 text-black'>
      <Sidebar fileMetadata={fileMetadata} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 space-y-8 overflow-x-hidden overflow-y-auto bg-gray-100 container mx-auto px-6 py-8'>
          <FileMetadata fileMetadata={fileMetadata} />
          <FileFeedback feedback={fileFeedback} />
        </main>
      </div>
    </div>
  );
}
