import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Folder, File, Trash } from 'lucide-react';
import { Folder as FolderType } from '@/lib/types';
import { DeleteFolderDialog } from './delete-folder-dialog';

interface FolderItemProps {
  folder: FolderType | { id: 'all'; name: 'All Documents' };
  isActive: boolean;
  onClick: () => void;
  level?: number;
}

function FolderItem({ folder, isActive, onClick, level = 0 }: FolderItemProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        p-2 cursor-pointer group rounded-md transition-all duration-200 ease-in-out border
        ${isActive ? 'bg-blue-50' : 'hover:bg-blue-50/50'}
        ${isOver ? 'border border-blue-500 bg-blue-50' : ''}
        ${level > 0 ? `ml-${level * 4}` : ''}
      `}
      onClick={onClick}
    >
      <div className='flex items-center space-x-2'>
        {folder.id === 'all' ? (
          <File size={18} fill='#171717' stroke='#171717' />
        ) : (
          <Folder size={18} fill='#171717' stroke='#171717' />
        )}
        <span className={`flex-grow truncate ${isActive ? 'font-medium' : ''}`}>
          {folder.name}
        </span>
        {folder.id !== 'all' && (
          <DeleteFolderDialog folder={folder}>
            <button
              aria-label='Delete folder'
              className='p-1 hover:bg-red-100 rounded-md sm:hidden group-hover:block '
            >
              <Trash size={16} className='text-red-600' />
            </button>
          </DeleteFolderDialog>
        )}
      </div>
    </div>
  );
}

interface FolderListProps {
  folders: FolderType[];
  activeFolderId: string | null;
  onFolderClick: (folderId: string | null) => void;
}

function FolderList({
  folders,
  activeFolderId,
  onFolderClick,
}: FolderListProps) {
  return (
    <div className='space-y-2 w-full'>
      <h3 className='text-lg font-semibold mb-3'>Folders</h3>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3'>
        <FolderItem
          folder={{ id: 'all', name: 'All Documents' }}
          isActive={!activeFolderId}
          onClick={() => onFolderClick(null)}
        />
        {folders.map((folder) => (
          <FolderItem
            key={folder.id}
            folder={folder}
            isActive={activeFolderId === folder.id}
            onClick={() => onFolderClick(folder.id)}
          />
        ))}
      </div>
    </div>
  );
}

export { FolderItem, FolderList };
