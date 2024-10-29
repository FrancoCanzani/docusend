'use client';

import { DocumentMetadata as DocumentMetadataType } from '@/lib/types';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { useQueryState } from 'nuqs';
import { Button } from '../ui/button';

type DocumentMetadataProps = {
  documentMetadata: DocumentMetadataType;
};

export default function DocumentHeader({
  documentMetadata,
}: DocumentMetadataProps) {
  const [tab, setTab] = useQueryState('tab', {
    defaultValue: 'views',
    shallow: false,
    parse: (value) =>
      ['views', 'feedback', 'settings'].includes(value) ? value : 'views',
  });

  return (
    <section className='w-full space-y-4 sm:space-y-6'>
      <div className='flex flex-col items-start justify-between space-y-6'>
        <h1 className='text-xl sm:text-2xl font-bold truncate mr-2'>
          {documentMetadata.sanitized_name}
        </h1>
        <div className='flex space-x-4 flex-shrink-0'>
          <button
            className={cn(
              'p-2 hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-300',
              tab === 'views' && 'border-b-2 text-black border-black font-bold'
            )}
            onClick={() => setTab('views')}
          >
            Views
          </button>
          <button
            className={cn(
              'p-2 hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-300',
              tab === 'feedback' &&
                'border-b-2 text-black border-black font-bold'
            )}
            onClick={() => setTab('feedback')}
          >
            Feedback
          </button>
          <button
            className={cn(
              'p-2 hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-300',
              tab === 'settings' &&
                'border-b-2 text-black border-black font-bold'
            )}
            onClick={() => setTab('settings')}
          >
            Settings
          </button>
          <Link
            className={cn(
              'p-2 hover:bg-gray-50 text-gray-700 font-medium transition-colors duration-300'
            )}
            href={`/view/${documentMetadata.document_id}`}
          >
            Visit
          </Link>
        </div>
      </div>
    </section>
  );
}
