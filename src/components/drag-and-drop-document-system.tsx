'use client';

import React, { useState } from 'react';
import {
  DndContext,
  pointerWithin,
  useDraggable,
  useDroppable,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { createClient } from '@/lib/supabase/client';
import { File, Folder } from 'lucide-react';
import { DocumentMetadata, Folder as FolderType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import NewFolderDialog from '@/components/new-folder-dialog';
import DocumentUploadDialog from './document/document-upload-dialog';
import { useRouter, useSearchParams } from 'next/navigation';

interface DocumentProps {
  document: DocumentMetadata;
  isDragging?: boolean;
}

const Document: React.FC<DocumentProps> = ({
  document,
  isDragging = false,
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: document.id,
  });

  const style: React.CSSProperties = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className='bg-white flex items-center p-2 mb-2 rounded-md shadow-sm'
    >
      <File className='mr-2' size={20} />
      <span className='flex-1 truncate pr-2'>{document.original_name}</span>
      <span className='text-sm text-gray-500'>
        {formatFileSize(document.document_size)}
      </span>
    </div>
  );
};

const FolderItem: React.FC<{
  folder: FolderType | { id: 'all'; name: 'All Documents' };
  isActive: boolean;
  onClick: () => void;
}> = ({ folder, isActive, onClick }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: folder.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`p-2 cursor-pointer rounded ${
        isActive ? 'bg-blue-100' : 'hover:bg-gray-100'
      } ${isOver ? 'border-2 border-blue-500' : ''}`}
      onClick={onClick}
    >
      <Folder className='inline-block mr-2' size={20} />
      {folder.name}
    </div>
  );
};

const FolderList: React.FC<{
  folders: FolderType[];
  activeFolderId: string | null;
  onFolderClick: (folderId: string | null) => void;
}> = ({ folders, activeFolderId, onFolderClick }) => {
  return (
    <div className='space-y-2'>
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
};

export default function DragDropDocumentSystem({
  initialDocuments,
  initialFolders,
}: {
  initialDocuments: DocumentMetadata[];
  initialFolders: FolderType[];
}) {
  const [documents, setDocuments] =
    useState<DocumentMetadata[]>(initialDocuments);
  const [folders, setFolders] = useState<FolderType[]>(initialFolders);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isDocumentUploadDialogOpen, setIsDocumentUploadDialogOpen] =
    useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFolderId = searchParams.get('folderId');

  const supabase = createClient();

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const updatedDocument = documents.find((doc) => doc.id === active.id);
      if (updatedDocument) {
        const newFolderId = over.id === 'all' ? null : (over.id as string);
        updatedDocument.folder_id = newFolderId;
        const { error } = await supabase
          .from('document_metadata')
          .update({ folder_id: newFolderId })
          .eq('id', active.id);

        if (error) {
          console.error('Error updating document:', error);
        } else {
          setDocuments((prevDocs) =>
            prevDocs.map((doc) =>
              doc.id === active.id ? updatedDocument : doc
            )
          );
        }
      }
    }

    setActiveId(null);
  };

  const handleNewFolderCreated = (newFolder: FolderType) => {
    setFolders([...folders, newFolder]);
  };

  const handleDocumentUploaded = async (file: File, name: string) => {
    const { data: authData } = await supabase.auth.getUser();
    if (!authData.user) return;

    const { data, error } = await supabase.storage
      .from('documents')
      .upload(`${authData.user.id}/${file.name}`, file);

    if (error) {
      console.error('Error uploading file:', error);
      return;
    }

    const { data: documentData, error: documentError } = await supabase
      .from('document_metadata')
      .insert([
        {
          user_id: authData.user.id,
          original_name: name,
          file_path: data.path,
          document_size: file.size,
          folder_id: activeFolderId,
        },
      ])
      .select();

    if (documentError) {
      console.error('Error creating document metadata:', documentError);
    } else if (documentData) {
      setDocuments([...documents, documentData[0]]);
    }
  };

  const handleFolderClick = (folderId: string | null) => {
    const params = new URLSearchParams(searchParams);
    if (folderId) {
      params.set('folderId', folderId);
    } else {
      params.delete('folderId');
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const activeDocument = documents.find((doc) => doc.id === activeId);

  const filteredDocuments = activeFolderId
    ? documents.filter((doc) => doc.folder_id === activeFolderId)
    : documents;

  return (
    <DndContext
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='p-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-2xl font-bold'>Documents</h2>
          <div className='flex items-end space-x-2'>
            <Button size={'sm'} onClick={() => setIsNewFolderDialogOpen(true)}>
              New Folder
            </Button>
            <Button
              size={'sm'}
              onClick={() => setIsDocumentUploadDialogOpen(true)}
            >
              Upload Document
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-4 gap-4'>
          <div className='col-span-1'>
            <FolderList
              folders={folders}
              activeFolderId={activeFolderId}
              onFolderClick={handleFolderClick}
            />
          </div>
          <div className='col-span-3'>
            <h3 className='text-xl font-semibold mb-2'>
              {activeFolderId
                ? folders.find((f) => f.id === activeFolderId)?.name
                : 'All Documents'}
            </h3>
            {filteredDocuments.map((doc) => (
              <Document key={doc.id} document={doc} />
            ))}
          </div>
        </div>
      </div>
      <DragOverlay>
        {activeId && activeDocument ? (
          <Document document={activeDocument} isDragging />
        ) : null}
      </DragOverlay>
      <NewFolderDialog
        isOpen={isNewFolderDialogOpen}
        onClose={() => setIsNewFolderDialogOpen(false)}
        onFolderCreated={handleNewFolderCreated}
      />
      <DocumentUploadDialog
        isOpen={isDocumentUploadDialogOpen}
        onClose={() => setIsDocumentUploadDialogOpen(false)}
        onUpload={handleDocumentUploaded}
      />
    </DndContext>
  );
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB';
  else return (bytes / 1073741824).toFixed(1) + ' GB';
};
