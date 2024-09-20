import { createClient } from '@/lib/supabase/server';
import FileMetadata from '@/components/file/file-metadata';
import { Sidebar } from '@/components/sidebar';
import FileFeedback from '@/components/file/file-feedback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

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
    <div className='flex h-screen text-black'>
      <Sidebar fileMetadata={fileMetadata} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 space-y-6 overflow-x-hidden overflow-y-auto bg-gray-50 container mx-auto px-3 py-6 md:px-6 md:py-8'>
          <FileMetadata fileMetadata={fileMetadata} />
          <Separator />
          <Tabs defaultValue='views' className='w-full'>
            <TabsList>
              <TabsTrigger value='views'>Views</TabsTrigger>
              <TabsTrigger value='feedback'>Feedback</TabsTrigger>
            </TabsList>
            <TabsContent value='views'>
              Make changes to your account here.
            </TabsContent>
            <TabsContent value='feedback'>
              {fileFeedback ? (
                <FileFeedback feedback={fileFeedback} />
              ) : (
                <p className='text-center text-muted-foreground'>
                  No feedback yet.
                </p>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
