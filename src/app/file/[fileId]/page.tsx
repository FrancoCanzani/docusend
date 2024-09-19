import { createClient } from '@/lib/supabase/server';
import FileViewer from '@/components/file/file-viewer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EmailForm from '@/components/forms/email_form';
import PasswordForm from '@/components/forms/password_form';
import NDAForm from '@/components/forms/nda_form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import FileWatermark from '@/components/file/file-watermark';

export default async function FileViewerPage({
  params,
}: {
  params: { fileId: string };
}) {
  const { fileId } = params;
  const supabase = createClient();
  const cookieStore = cookies();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { data: fileMetadata, error: metadataError } = await supabase
      .from('file_metadata')
      .select('*')
      .eq('file_id', fileId)
      .single();

    if (metadataError) throw new Error('File not found');

    if (!fileMetadata.is_public) {
      if (!user) {
        redirect('/');
      }
    }

    if (
      fileMetadata.is_expiring &&
      new Date(fileMetadata.expiration_date) < new Date()
    ) {
      return (
        <div className='max-w-5xl m-auto h-screen flex items-center justify-center p-8 md:p-16'>
          <Alert>
            <AlertTitle className='text-red-600'>File Expired</AlertTitle>
            <AlertDescription>
              This file is no longer accessible as the expiration date has
              passed. To obtain a new link or further assistance, please contact
              the file provider.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Check if email is required
    const emailVerified =
      cookieStore.get(`email_verified_${fileId}`)?.value === 'true';
    if (fileMetadata.require_email && !emailVerified) {
      return <EmailForm fileId={fileId} />;
    }

    // Check if password is required
    const passwordVerified =
      cookieStore.get(`password_verified_${fileId}`)?.value === 'true';
    if (fileMetadata.require_password && !passwordVerified) {
      return <PasswordForm fileId={fileId} />;
    }

    // Check if NDA is required
    const ndaAccepted =
      cookieStore.get(`nda_accepted_${fileId}`)?.value === 'true';
    if (fileMetadata.require_nda && !ndaAccepted) {
      return <NDAForm fileId={fileId} ndaText={fileMetadata.nda_text} />;
    }

    // Generate signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(fileMetadata.file_path, 3600); // URL expires in 1 hour

    if (urlError) throw new Error('Failed to generate file URL');

    const fileUrl = urlData.signedUrl;

    return (
      <div className='container mx-auto'>
        <h1 className='text-xl font-bold pt-6'>{fileMetadata.original_name}</h1>
        <FileViewer fileUrl={fileUrl} fileMetadata={fileMetadata} />
        <FileWatermark />
      </div>
    );
  } catch (error) {
    console.error('Error loading file data:', error);
    return <div>Error: {(error as Error).message}</div>;
  }
}
