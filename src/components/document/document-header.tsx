'use client';

import { DocumentMetadata as DocumentMetadataType } from '@/lib/types';
import Link from 'next/link';
import DocumentSettingsSheet from '@/components/document-settings-sheet';

type DocumentMetadataProps = {
  documentMetadata: DocumentMetadataType;
};

export default function DocumentHeader({
  documentMetadata,
}: DocumentMetadataProps) {
  return (
    <section className='w-full space-y-4 sm:space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl sm:text-2xl font-bold truncate mr-2'>
          {documentMetadata.original_name}
        </h1>
        <div className='flex space-x-4 flex-shrink-0'>
          <Link
            href={`/view/${documentMetadata.document_id}`}
            className='font-bold'
          >
            Visit
          </Link>
          <DocumentSettingsSheet documentMetadata={documentMetadata}>
            <button className='font-bold'>Settings</button>
          </DocumentSettingsSheet>
        </div>
      </div>
    </section>
  );
}
