'use client';

import { Plus } from 'lucide-react';
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { DocumentUploadDialog } from './document/document-upload-dialog';
import { useUser } from '@/lib/hooks/use-user';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import sanitizeDocumentName from '@/lib/helpers/sanitize-document-name';
import { uploadDocument } from '@/lib/actions';
import { v4 as uuidv4 } from 'uuid';
import DashboardTable from './dashboard-table';
import { DocumentMetadata } from '@/lib/types';
import RecentDocumentCard from './recent-document-card';

interface DashboardProps {
  documentMetadata: DocumentMetadata[];
}

export function Dashboard({ documentMetadata }: DashboardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const handleUpload = async (file: File, name: string) => {
    if (!user) {
      toast.error('You must be logged in to upload documents');
      return;
    }
    const documentId = uuidv4();
    const sanitizedName = sanitizeDocumentName(name);
    const uniqueDocumentName = `${documentId}_${sanitizedName}`;
    const documentPath = `${user.id}/${uniqueDocumentName}`;

    toast.promise(
      (async () => {
        const { error } = await supabase.storage
          .from('documents')
          .upload(documentPath, file);

        if (error) throw error;

        const currentDate = new Date().toISOString();
        const metadata: DocumentMetadata = {
          id: uuidv4(),
          user_id: user.id,
          document_id: documentId,
          original_name: name,
          sanitized_name: sanitizedName,
          document_path: documentPath,
          document_size: file.size,
          document_type: file.type,
          upload_date: currentDate,
          last_modified: new Date(file.lastModified).toISOString(),
          is_public: false,
          allow_download: true,
          require_email: false,
          is_expiring: false,
          expiration_date: null,
          require_password: false,
          password: null,
          enable_feedback: false,
          require_nda: false,
          nda_text: null,
        };

        await uploadDocument(metadata);
        setIsDialogOpen(false);
        router.refresh();
      })(),
      {
        loading: 'Uploading document...',
        success: 'Document uploaded successfully!',
        error: 'Failed to upload document. Please try again.',
      }
    );
  };

  const recentDocuments = useMemo(() => {
    return documentMetadata
      .sort(
        (a, b) =>
          new Date(b.upload_date).getTime() - new Date(a.upload_date).getTime()
      )
      .slice(0, 3);
  }, [documentMetadata]);

  return (
    <div className='container mx-auto px-3 py-6 md:px-6 md:py-8 space-y-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold'>Documents</h1>
        <Button
          className='bg-blue-800 hover:bg-blue-800/90'
          size={'sm'}
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus size={16} className='mr-2' />
          New
        </Button>
      </div>

      {recentDocuments && (
        <div>
          <h3 className='font-medium text-lg mb-2'>Recent</h3>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {recentDocuments.map((doc) => (
              <RecentDocumentCard key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className='font-medium text-lg mb-2'>All documents</h3>
        <DashboardTable documentMetadata={documentMetadata} />
      </div>

      <DocumentUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
