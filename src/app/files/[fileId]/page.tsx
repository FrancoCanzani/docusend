import { createClient } from '@/lib/supabase/server';
import FileViewer from '@/components/file-viewer';

export default async function FileViewerPage({
  params,
}: {
  params: { fileId: string };
}) {
  const { fileId } = params;
  const supabase = createClient();

  try {
    // Fetch file metadata
    const { data: fileData, error: metadataError } = await supabase
      .from('file_metadata')
      .select('*')
      .eq('file_id', fileId)
      .single();

    if (metadataError) throw new Error('File not found');

    // Generate signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(fileData.file_path, 3600); // URL expires in 1 hour

    if (urlError) throw new Error('Failed to generate file URL');

    const fileUrl = urlData.signedUrl;

    return (
      <div className='container mx-auto px-4 py-8'>
        <h1 className='text-xl font-bold mb-4'>{fileData.original_name}</h1>
        <div className='w-full h-[80vh]'>
          <FileViewer fileUrl={fileUrl} fileType={fileData.file_type} />
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading file data:', error);
    return <div>Error: {(error as Error).message}</div>;
  }
}
