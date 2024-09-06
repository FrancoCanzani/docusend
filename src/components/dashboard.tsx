'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function Dashboard() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddDocument = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Here you would typically handle the document addition logic
    console.log('Document added');
    setIsDialogOpen(false);
  };

  return (
    <div className='container mx-auto px-6 py-8'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold text-gray-900'>Dashboard</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className='flex items-center gap-2'>
              <PlusCircle className='h-5 w-5' />
              Add Document
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Document</DialogTitle>
              <DialogDescription>
                Upload a new document to your DocuSend account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddDocument} className='space-y-4'>
              <div>
                <Label htmlFor='documentName'>Document Name</Label>
                <Input id='documentName' placeholder='Enter document name' />
              </div>
              <div>
                <Label htmlFor='documentFile'>Upload File</Label>
                <Input id='documentFile' type='file' />
              </div>
              <Button type='submit' className='w-full'>
                Upload Document
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <div className='bg-white shadow rounded-lg p-6'>
        <p className='text-gray-600'>
          Your documents will appear here. Click the Add Document button to get
          started.
        </p>
      </div>
    </div>
  );
}
