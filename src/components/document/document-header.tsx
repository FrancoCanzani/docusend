'use client';

import { DocumentMetadata as DocumentMetadataType } from '@/lib/types';
import Link from 'next/link';
import DocumentSettingsSheet from './document-settings-sheet';
import { Button } from '../ui/button';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';

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
          {documentMetadata.sanitized_name}
        </h1>
        <div className='flex space-x-4 flex-shrink-0'>
          <Link
            href={`/view/${documentMetadata.document_id}`}
            className={cn(buttonVariants({ variant: 'outline', size: 'sm' }))}
          >
            Visit
          </Link>
          <DocumentSettingsSheet documentMetadata={documentMetadata}>
            <Button variant={'outline'} size={'sm'} className='font-bold'>
              Settings
            </Button>
          </DocumentSettingsSheet>
        </div>
      </div>
    </section>
  );
}
