'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface DownloadButtonProps {
  filePath: string;
  fileName: string;
  bucketName?: string;
}

const getMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
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

export default function DownloadFileButton({
  filePath,
  fileName,
  bucketName = 'documents',
}: DownloadButtonProps) {
  const supabase = createClient();

  const handleDownload = async () => {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .download(filePath);

      if (error) {
        throw error;
      }

      const mimeType = getMimeType(fileName);
      const blob = new Blob([data], { type: mimeType });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      toast.error('Error downloading file');
    }
  };

  return (
    <Button
      onClick={handleDownload}
      size='icon'
      variant='outline'
      title={`Download ${fileName}`}
      className='h-8 w-8'
    >
      <Download className='h-4 w-4' />
    </Button>
  );
}
