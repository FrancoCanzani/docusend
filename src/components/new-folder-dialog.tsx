import React, { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface NewFolderDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onFolderCreated: (newFolder: any) => void;
}

export default function NewFolderDialog({
  isOpen,
  onClose,
  onFolderCreated,
}: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (folderName.trim()) {
      const { data: authData } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('folders')
        .insert([{ name: folderName.trim(), user_id: authData.user?.id }])
        .select();

      if (error) {
        console.error('Error creating folder:', error);
      } else {
        onFolderCreated(data[0]);
        setFolderName('');
        onClose();
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create New Folder</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Name
              </Label>
              <Input
                id='name'
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className='col-span-3'
              />
            </div>
          </div>
          <DialogFooter>
            <Button type='submit'>Create Folder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
