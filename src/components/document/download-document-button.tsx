'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  documentPath: string;
  documentName: string;
  bucketName?: string;
  className?: string;
}

const getMimeType = (documentName: string): string => {
  const extension = documentName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'application/pdf';
    case 'doc':
    case 'docx':
      return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    case 'xls':
    case 'xlsx':
      return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    case 'ppt':
    case 'pptx':
      return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
};

export default function DownloadDocumentButton({
  documentPath,
  documentName,
  bucketName = 'documents',
  className,
}: DownloadButtonProps) {
  const supabase = createClient();

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(documentPath);

      if (error) {
        throw error;
      }

      const mimeType = getMimeType(documentName);
      const blob = new Blob([data], { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = documentName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error('Error downloading document');
    }
  };

  return (
    <Button
      onClick={handleDownload}
      size='icon'
      variant='outline'
      title={`Download ${documentName}`}
      className={cn('h-8 w-8', className)}
    >
      <Download className='h-4 w-4' />
    </Button>
  );
}
