import { createClient } from '@/lib/supabase/server';
import DocumentViewer from '@/components/document/document-viewer';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import EmailForm from '@/components/forms/email_form';
import PasswordForm from '@/components/forms/password_form';
import NDAForm from '@/components/forms/nda_form';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import DocumentWatermark from '@/components/document/document-watermark';

export default async function DocumentViewerPage({
  params,
}: {
  params: { documentId: string };
}) {
  const { documentId } = params;
  const supabase = createClient();
  const cookieStore = cookies();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  try {
    const { data: documentMetadata, error: metadataError } = await supabase
      .from('document_metadata')
      .select('*')
      .eq('document_id', documentId)
      .single();

    if (metadataError) throw new Error('Document not found');

    if (!documentMetadata.is_public) {
      if (!user) {
        redirect('/');
      }
    }

    if (
      documentMetadata.is_expiring &&
      new Date(documentMetadata.expiration_date) < new Date()
    ) {
      return (
        <div className='max-w-5xl m-auto h-screen flex items-center justify-center p-8 md:p-16'>
          <Alert>
            <AlertTitle className='text-red-600'>Document Expired</AlertTitle>
            <AlertDescription>
              This document is no longer accessible as the expiration date has
              passed. To obtain a new link or further assistance, please contact
              the document provider.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    // Check if email is required
    const emailVerified =
      cookieStore.get(`email_verified_${documentId}`)?.value === 'true';
    if (documentMetadata.require_email && !emailVerified) {
      return <EmailForm documentId={documentId} />;
    }

    // Check if password is required
    const passwordVerified =
      cookieStore.get(`password_verified_${documentId}`)?.value === 'true';
    if (documentMetadata.require_password && !passwordVerified) {
      return <PasswordForm documentId={documentId} />;
    }

    // Check if NDA is required
    const ndaAccepted =
      cookieStore.get(`nda_accepted_${documentId}`)?.value === 'true';
    if (documentMetadata.require_nda && !ndaAccepted) {
      return (
        <NDAForm documentId={documentId} ndaText={documentMetadata.nda_text} />
      );
    }

    // Generate signed URL
    const { data: urlData, error: urlError } = await supabase.storage
      .from('documents')
      .createSignedUrl(documentMetadata.document_path, 3600); // URL expires in 1 hour

    if (urlError) throw new Error('Failed to generate document URL');

    const documentUrl = urlData.signedUrl;

    return (
      <div className='container mx-auto'>
        <h1 className='text-xl font-bold pt-6'>
          {documentMetadata.original_name}
        </h1>
        <DocumentViewer
          documentUrl={documentUrl}
          documentMetadata={documentMetadata}
        />
        <DocumentWatermark />
      </div>
    );
  } catch (error) {
    console.error('Error loading document data:', error);
    return <div>Error: {(error as Error).message}</div>;
  }
}
