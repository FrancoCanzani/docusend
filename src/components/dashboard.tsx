'use client';

import React from 'react';
import { DocumentMetadata, Folder } from '@/lib/types';
import { CreateFolderDialog } from './create-folder-dialog';
import { useRouter, useSearchParams } from 'next/navigation';
import { FolderList } from './folder-list';
import DocumentUploadDialog from './document/document-upload-dialog';
import DashboardTable from './dashboard-table';

export default function Dashboard({
  documents,
  folders,
}: {
  documents: DocumentMetadata[];
  folders: Folder[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeFolderId = searchParams.get('folderId');

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
    <div>
      <div className='flex justify-between items-center mb-8'>
        <h2 className='text-2xl font-bold'>Documents</h2>
        <div className='flex items-end space-x-2'>
          <CreateFolderDialog />
          <DocumentUploadDialog folderId={activeFolderId} />
        </div>
      </div>
      <div className='space-y-8'>
        <FolderList
          folders={folders}
          activeFolderId={activeFolderId}
          onFolderClick={handleFolderClick}
        />
        <DashboardTable
          documentMetadata={filteredDocuments}
          folders={folders}
          activeFolderId={activeFolderId}
        />
      </div>
    </div>
  );
}
