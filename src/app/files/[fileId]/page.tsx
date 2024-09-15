import { createClient } from '@/lib/supabase/server';
import FileViewer from '@/components/file/file-viewer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EmailForm from '@/components/forms/email_form';
import PasswordForm from '@/components/forms/password_form';
import NDAForm from '@/components/forms/nda_form';

export default async function FileViewerPage({
  params,
}: {
  params: { fileId: string };
}) {
  const { fileId } = params;
  const supabase = createClient();
  const cookieStore = cookies();

  try {
    const { data: fileData, error: metadataError } = await supabase
      .from('file_metadata')
      .select('*')
      .eq('file_id', fileId)
      .single();

    if (metadataError) throw new Error('File not found');

    if (!fileData.is_public) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect('/');
      }
    }

    // Check if the file has expired
    if (
      fileData.is_expiring &&
      new Date(fileData.expiration_date) < new Date()
    ) {
      return <div>This file has expired and is no longer available.</div>;
    }

    // Check if email is required
    const emailVerified =
      cookieStore.get(`email_verified_${fileId}`)?.value === 'true';
    if (fileData.require_email && !emailVerified) {
      return <EmailForm fileId={fileId} />;
    }

    // Check if password is required
    const passwordVerified =
      cookieStore.get(`password_verified_${fileId}`)?.value === 'true';
    if (fileData.require_password && !passwordVerified) {
      return <PasswordForm fileId={fileId} />;
    }

    // Check if NDA is required
    const ndaAccepted =
      cookieStore.get(`nda_accepted_${fileId}`)?.value === 'true';
    if (fileData.require_nda && !ndaAccepted) {
      return <NDAForm fileId={fileId} ndaText={fileData.nda_text} />;
    }

    // Generate signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(fileData.file_path, 3600); // URL expires in 1 hour

    if (urlError) throw new Error('Failed to generate file URL');

    const fileUrl = urlData.signedUrl;

    return (
      <div className='container mx-auto p-4'>
        <h1 className='text-xl font-bold mb-3'>{fileData.original_name}</h1>
        <div className='w-full h-[80vh]'>
          <FileViewer fileUrl={fileUrl} fileType={fileData.file_type} />
          {/* todo: add feedback and download button  */}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error loading file data:', error);
    return <div>Error: {(error as Error).message}</div>;
  }
}
