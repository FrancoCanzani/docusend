'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { FileUploadDialog } from './file-upload-dialog';
import { useUser } from '@/lib/hooks/use-user';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import sanitizeFilename from '@/lib/helpers/sanitize-file-name';
import { uploadDocument } from '@/lib/actions'; // Import the server action
import { v4 as uuidv4 } from 'uuid';

export function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();
  const supabase = createClient();

  const handleUpload = async (file: File, name: string) => {
    if (!user) {
      toast.error('You must be logged in to upload documents');
      return;
    }

    const fileId = uuidv4(); // Generate a UUID for the file
    const sanitizedName = sanitizeFilename(name);
    const uniqueFilename = `${fileId}_${sanitizedName}`;
    const filePath = `${user.id}/${uniqueFilename}`;

    toast.promise(
      (async () => {
        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage
          .from('documents')
          .upload(filePath, file);
        if (error) throw error;

        console.log(data);

        // Prepare metadata
        const metadata = {
          user_id: user.id,
          file_id: fileId,
          original_name: name,
          sanitized_name: sanitizedName,
          file_path: filePath,
          file_size: file.size,
          file_type: file.type,
          last_modified: new Date(file.lastModified).toISOString(),
        };

        // Call server action to store metadata
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

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
        <Button
          className='flex items-center gap-2'
          onClick={() => setIsDialogOpen(true)}
        >
          <PlusCircle className='h-5 w-5' />
          Add Document
        </Button>
      </div>
      <div className='bg-white shadow rounded-lg p-6'>
        <p className='text-gray-600'>
          Your documents will appear here. Click the Add Document button to get
          started.
        </p>
      </div>
      <FileUploadDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
