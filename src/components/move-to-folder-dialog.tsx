'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DocumentMetadata, Folder } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface MoveToFolderDialogProps {
  documents: DocumentMetadata[];
  folders: Folder[];
  onMoveSuccess: () => void;
}

export function MoveToFolderDialog({
  documents,
  folders,
  onMoveSuccess,
}: MoveToFolderDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleMove = async () => {
    if (documents.length === 0) {
      toast.error('No documents selected to move');
      return;
    }

    const { error } = await supabase
      .from('document_metadata')
      .update({ folder_id: selectedFolderId })
      .in(
        'document_id',
        documents.map((document) => document.document_id)
      );

    if (error) {
      console.error('Error moving documents:', error);
      toast.error('Failed to move documents. Please try again.');
    } else {
      onMoveSuccess();
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>Move to Folder</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Move to Folder</DialogTitle>
          <DialogDescription>
            Select a folder to move the selected document(s) to.
          </DialogDescription>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <Select
            onValueChange={(value) =>
              setSelectedFolderId(value === 'root' ? null : value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Select a folder' />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value='root'>Root</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.id}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button type='submit' onClick={handleMove}>
            Move
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
