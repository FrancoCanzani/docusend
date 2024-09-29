import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Folder, ChevronRight, File } from 'lucide-react';
import { Folder as FolderType } from '@/lib/types';

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
        p-2 cursor-pointer rounded-md transition-all duration-200 ease-in-out bg-gray-50
        ${isActive ? 'bg-blue-100' : 'hover:bg-blue-50'}
        ${isOver ? 'border border-blue-500 bg-blue-50' : ''}
        ${level > 0 ? `ml-${level * 4}` : ''}
      `}
      onClick={onClick}
    >
      <div className='flex items-center space-x-2'>
        {folder.id === 'all' ? (
          <File size={18} className='text-gray-500' />
        ) : (
          <Folder size={18} />
        )}
        <span className={`flex-grow ${isActive ? 'font-medium' : ''}`}>
          {folder.name}
        </span>
        {folder.id !== 'all' && (
          <ChevronRight size={16} className='text-gray-400' />
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
    <div className='space-y-1'>
      <h3 className='text-lg font-semibold mb-3'>Folders</h3>
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
  );
}

export { FolderItem, FolderList };
