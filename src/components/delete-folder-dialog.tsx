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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Folder } from '@/lib/types';
import { toast } from 'sonner';
import { deleteFolder } from '@/lib/actions';
import { useRouter } from 'next/navigation';

export function DeleteFolderDialog({
  children,
  folder,
}: {
  children: React.ReactNode;
  folder: Folder | { id: 'all'; name: 'All Documents' };
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [folderNameInput, setFolderNameInput] = useState('');
  const router = useRouter();

  const handleDelete = async () => {
    if (folderNameInput !== folder.name) {
      toast.error("Folder name doesn't match. Please try again.");
      return;
    }

    toast.promise(deleteFolder(folder.id), {
      loading: 'Deleting folder...',
      success: () => {
        setIsOpen(false);
        return `Folder ${folder.name} has been deleted`;
      },
      error: 'An error occurred while deleting. Please try again.',
    });

    router.push('/documents');
    router.refresh();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='sm:max-w-[425px] space-y-2'>
        <DialogHeader>
          <DialogTitle>Delete folder</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the
            folder <span className='font-medium text-black'>{folder.name}</span>{' '}
            and all documents inside it.
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col space-y-2 items-start'>
          <Label htmlFor='folderName'>Folder Name</Label>
          <Input
            id='folderName'
            value={folderNameInput}
            onChange={(e) => setFolderNameInput(e.target.value)}
            className='col-span-3'
            placeholder='Type folder name to confirm'
          />
        </div>
        <DialogFooter>
          <Button
            size={'sm'}
            variant='outline'
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            size={'sm'}
            onClick={handleDelete}
            disabled={folderNameInput !== folder.name}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
