'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { FileUploadDialog } from './file-upload-dialog';

export function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleUpload = (file: File, name: string) => {
    // Here you would typically handle the document addition logic
    console.log('Document added:', name, file);
    // You can add your upload logic here
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
