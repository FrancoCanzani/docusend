'use client';

import React, { useState } from 'react';
import {
  DndContext,
  pointerWithin,
  useSensor,
  useSensors,
  MouseSensor,
  DragOverlay,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { createClient } from '@/lib/supabase/client';
import { DocumentMetadata, Folder as FolderType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import NewFolderDialog from '@/components/new-folder-dialog';
import DocumentUploadDialog from './document/document-upload-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import Document from './document';
import { FolderList } from './folder-list';

function DragDropDocumentSystem({
  initialDocuments,
  initialFolders,
}: {
  initialDocuments: DocumentMetadata[];
  initialFolders: FolderType[];
}) {
  const [documents, setDocuments] =
    useState<DocumentMetadata[]>(initialDocuments);
  const [folders, setFolders] = useState<FolderType[]>(initialFolders);
  const [isNewFolderDialogOpen, setIsNewFolderDialogOpen] = useState(false);
  const [isDocumentUploadDialogOpen, setIsDocumentUploadDialogOpen] =
    useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFolderId = searchParams.get('folderId');

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { distance: 1 },
    })
  );

  const supabase = createClient();

  function handleDragStart(event: DragStartEvent) {
    setActiveId(event.active.id as string);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    setActiveId(null);

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
          toast.error('Error moving document');
        } else {
          setDocuments((prevDocs) =>
            prevDocs.map((doc) =>
              doc.id === active.id ? updatedDocument : doc
            )
          );
        }
      }
    }
  }

  function handleNewFolderCreated(newFolder: FolderType) {
    setFolders([...folders, newFolder]);
  }

  async function handleDocumentUploaded(file: File, name: string) {
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
  }

  function handleFolderClick(folderId: string | null) {
    const params = new URLSearchParams(searchParams);
    if (folderId) {
      params.set('folderId', folderId);
    } else {
      params.delete('folderId');
    }
    router.push(`/dashboard?${params.toString()}`);
  }

  const filteredDocuments = activeFolderId
    ? documents.filter((doc) => doc.folder_id === activeFolderId)
    : documents;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={pointerWithin}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className='p-4'>
        <div className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-bold'>Documents</h2>
          <div className='flex items-end space-x-2'>
            <Button
              size={'sm'}
              variant={'outline'}
              className='bg-blue-950 text-white hover:bg-blue-950/90 hover:text-white'
              onClick={() => setIsNewFolderDialogOpen(true)}
            >
              New Folder
            </Button>
            <Button
              size={'sm'}
              variant={'outline'}
              className='bg-blue-950 text-white hover:bg-blue-950/90 hover:text-white'
              onClick={() => setIsDocumentUploadDialogOpen(true)}
            >
              Upload Document
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-4'>
          <div className='col-span-1'>
            <FolderList
              folders={folders}
              activeFolderId={activeFolderId}
              onFolderClick={handleFolderClick}
            />
          </div>
          <div className='col-span-3'>
            <h3 className='text-lg font-semibold mb-2'>
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
        {activeId ? (
          <Document
            document={documents.find((doc) => doc.id === activeId)!}
            isDragging={true}
          />
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

export default DragDropDocumentSystem;
