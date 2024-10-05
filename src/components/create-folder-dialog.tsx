'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function CreateFolderDialog() {
  const [newFolderName, setNewFolderName] = useState('');
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleNewFolderCreated() {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) {
      toast.error('User not authenticated');
      return;
    }

    const { data, error } = await supabase
      .from('folders')
      .insert([{ name: newFolderName, user_id: authData.user.id }])
      .select();

    if (error) {
      console.error('Error creating folder:', error);
      toast.error('Error creating folder. Please try again.');
    } else if (data) {
      setNewFolderName('');
      router.refresh();
      setOpen(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} variant={'outline'}>
          New Folder
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] space-y-2'>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
          <DialogDescription>
            Enter a name for your new folder.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleNewFolderCreated();
          }}
        >
          <Label htmlFor='folderName'>Folder Name</Label>
          <Input
            id='folderName'
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            className='col-span-3'
          />
        </form>
        <DialogFooter>
          <Button type='submit' onClick={handleNewFolderCreated}>
            Create Folder
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
