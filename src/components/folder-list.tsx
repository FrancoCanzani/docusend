'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Folder as FolderIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Folder } from '@/lib/types';

interface FolderListProps {
  folders: Folder[];
}

export function FolderList({ folders }: FolderListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleFolderClick = (folderId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (folderId) {
      params.set('folderId', folderId);
    } else {
      params.delete('folderId');
    }
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className='space-y-2'>
      <Button
        variant='ghost'
        className='w-full justify-start'
        onClick={() => handleFolderClick(null)}
      >
        <FolderIcon className='mr-2 h-4 w-4' />
        All Documents
      </Button>
      {folders.map((folder) => (
        <Button
          key={folder.id}
          variant='ghost'
          className='w-full justify-start'
          onClick={() => handleFolderClick(folder.id)}
        >
          <FolderIcon className='mr-2 h-4 w-4' />
          {folder.name}
        </Button>
      ))}
    </div>
  );
}
