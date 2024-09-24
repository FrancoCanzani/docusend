import { createClient } from '@/lib/supabase/server';
import DocumentMetadata from '@/components/document/document-metadata';
import { Sidebar } from '@/components/sidebar';
import DocumentFeedback from '@/components/document/document-feedback';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import DocumentViews from '@/components/document/document-views';
import getDocumentAnalytics from '@/lib/helpers/get-document-analytics';
import DocumentViewsMap from '@/components/document/document-views-map';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { MessageCircleOff, EyeOff, MapPinOff } from 'lucide-react';
import DocumentTimeMetrics from '@/components/document/document-time-metrics';

export default async function Page({
  params,
}: {
  params: { documentId: string };
}) {
  const { documentId } = params;
  const supabase = createClient();
  const { data: authData } = await supabase.auth.getUser();

  const { data: documentMetadata } = await supabase
    .from('document_metadata')
    .select('*')
    .eq('document_id', documentId)
    .eq('user_id', authData.user?.id)
    .single();

  const { data: documentFeedback } = await supabase
    .from('document_feedback')
    .select('*')
    .eq('document_id', documentId);

  const documentAnalytics = await getDocumentAnalytics(documentId);

  // console.log(documentAnalytics.results[0].properties);

  return (
    <div className='flex h-screen text-black'>
      <Sidebar documentMetadata={documentMetadata} />
      <div className='flex-1 flex flex-col overflow-hidden'>
        <main className='flex-1 space-y-6 overflow-x-hidden overflow-y-auto bg-gray-50 container mx-auto px-3 py-6 md:px-6 md:py-8'>
          <DocumentMetadata documentMetadata={documentMetadata} />
          <Separator />
          <Tabs defaultValue='views' className='w-full'>
            <TabsList className='text-base lg:text-lg'>
              <TabsTrigger value='views'>Views</TabsTrigger>
              <TabsTrigger value='feedback'>Feedback</TabsTrigger>
              <TabsTrigger value='geolocation'>Geolocation</TabsTrigger>
            </TabsList>
            <TabsContent value='views' className='mt-6'>
              {documentAnalytics && documentAnalytics.results.length > 0 ? (
                <DocumentViews documentViews={documentAnalytics.results} />
              ) : (
                <Alert>
                  <EyeOff className='h-4 w-4' />
                  <AlertTitle>No views recorded</AlertTitle>
                  <AlertDescription>
                    Your content hasn&apos;t been viewed yet. Share your links
                    on social media and with your network to increase engagement
                    and reach a wider audience.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            <TabsContent value='feedback' className='mt-6'>
              {documentFeedback && documentFeedback.length > 0 ? (
                <DocumentFeedback feedback={documentFeedback} />
              ) : (
                <Alert>
                  <MessageCircleOff className='h-4 w-4' />
                  <AlertTitle>No feedback recorded</AlertTitle>
                  <AlertDescription>
                    Your content hasn&apos;t received any feedback yet. Share
                    your links on social media and with your network to increase
                    engagement and reach a wider audience.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            <TabsContent value='geolocation' className='mt-6'>
              {documentAnalytics && documentAnalytics.results.length > 0 ? (
                <DocumentViewsMap documentViews={documentAnalytics.results} />
              ) : (
                <Alert>
                  <MapPinOff className='h-4 w-4' />
                  <AlertTitle>No geodata recorded</AlertTitle>
                  <AlertDescription>
                    Your content hasn&apos;t been viewed yet. Share your links
                    on social media and with your network to increase engagement
                    and reach a wider audience.
                  </AlertDescription>
                </Alert>
              )}{' '}
            </TabsContent>
          </Tabs>
          {/* <DocumentTimeMetrics documentId={documentId} /> */}
        </main>
      </div>
    </div>
  );
}
