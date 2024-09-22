import { createClient } from '@/lib/supabase/server';
import FileMetadata from '@/components/file/file-metadata';
import { Sidebar } from '@/components/sidebar';
import FileFeedback from '@/components/file/file-feedback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import FileViews from '@/components/file/file-views';
import getFileAnalytics from '@/lib/helpers/get-file-analytics';
import FileViewsMap from '@/components/file/file-views-map';

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

  const fileAnalytics = await getFileAnalytics(fileId);

  return (
    <div className='flex h-screen text-black'>
      <Sidebar fileMetadata={fileMetadata} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 space-y-6 overflow-x-hidden overflow-y-auto bg-gray-50 container mx-auto px-3 py-6 md:px-6 md:py-8'>
          <FileMetadata fileMetadata={fileMetadata} />
          <Separator />
          <Tabs defaultValue='views' className='w-full'>
            <TabsList className='text-base lg:text-lg'>
              <TabsTrigger value='views'>Views</TabsTrigger>
              <TabsTrigger value='feedback'>Feedback</TabsTrigger>
              <TabsTrigger value='geolocation'>Geolocation</TabsTrigger>
            </TabsList>
            <TabsContent value='views' className='mt-6'>
              {fileViews ? (
                <FileViews fileViews={fileAnalytics.results} />
              ) : (
                <p className='text-center text-muted-foreground'>
                  No Views yet.
                </p>
              )}{' '}
            </TabsContent>
            <TabsContent value='feedback' className='mt-6'>
              {fileFeedback ? (
                <FileFeedback feedback={fileFeedback} />
              ) : (
                <p className='text-center text-muted-foreground'>
                  No feedback yet.
                </p>
              )}
            </TabsContent>
            <TabsContent value='geolocation' className='mt-6'>
              {fileViews ? (
                <FileViewsMap fileViews={fileAnalytics.results} />
              ) : (
                <p className='text-center text-muted-foreground'>
                  No Geodata yet.
                </p>
              )}{' '}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
