import { createClient } from '@/lib/supabase/server';
import DocumentFeedback from '@/components/document/document-feedback';
import DocumentHeader from '@/components/document/document-header';
import DocumentViews from '@/components/document/document-views';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageCircleOff, EyeOff } from 'lucide-react';
import DocumentSettings from '@/components/document/document-settings';
import { parseAsStringLiteral } from 'nuqs/server';

type Params = Promise<{ documentId: string }>;

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { documentId } = await params;
  const resolvedSearchParams = await searchParams;

  const tab =
    parseAsStringLiteral(['views', 'feedback', 'settings']).parseServerSide(
      resolvedSearchParams.tab
    ) ?? 'views';

  const supabase = await createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { data: documentMetadata } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('document_id', documentId)
    .eq('user_id', authData.user?.id)
    .single();

  const { data: documentFeedback } =
    tab === 'feedback'
      ? await supabase
          .from('document_feedback')
          .select('*')
          .eq('document_id', documentId)
      : { data: null };

  const { data: documentAnalytics } =
    tab === 'views'
      ? await supabase
          .from('document_analytics')
          .select('*')
          .eq('document_id', documentId)
      : { data: null };

  return (
    <main className='flex-1 space-y-6 overflow-x-hidden overflow-y-auto container mx-auto'>
      <DocumentHeader documentMetadata={documentMetadata} />

      {tab === 'views' &&
        (documentAnalytics && documentAnalytics.length > 0 ? (
          <DocumentViews documentViews={documentAnalytics} />
        ) : (
          <Alert>
            <EyeOff className='h-4 w-4' />
            <AlertTitle>No views recorded</AlertTitle>
            <AlertDescription>
              Your content hasn&apos;t been viewed yet. Share your links on
              social media and with your network to increase engagement and
              reach a wider audience.
            </AlertDescription>
          </Alert>
        ))}

      {tab === 'feedback' &&
        (documentFeedback && documentFeedback.length > 0 ? (
          <DocumentFeedback feedback={documentFeedback} />
        ) : (
          <Alert>
            <MessageCircleOff className='h-4 w-4' />
            <AlertTitle>No feedback recorded</AlertTitle>
            <AlertDescription>
              Your content hasn&apos;t received any feedback yet. Share your
              links on social media and with your network to increase engagement
              and reach a wider audience.
            </AlertDescription>
          </Alert>
        ))}

      {tab === 'settings' && (
        <DocumentSettings documentMetadata={documentMetadata} />
      )}
    </main>
  );
}
