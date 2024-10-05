import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { DocumentMetadata } from '@/lib/types';
import { formatFileSize } from '@/lib/helpers/format-file-size';
import { formatDistanceToNowStrict } from 'date-fns';
import { Eye, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { getDocumentTypeFromMime } from '@/lib/helpers/get-document-type';

interface DocumentProps {
  document: DocumentMetadata;
  isDragging?: boolean;
}

export default function Document({
  document,
  isDragging = false,
}: DocumentProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: document.id,
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`bg-white border hover:bg-gray-50 p-2.5 mb-2 rounded-md transition-all duration-200 ease-in-out ${
        isDragging ? 'opacity-75' : ''
      }`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex flex-col space-y-1 min-w-0 flex-1'>
          <div className='font-medium truncate flex space-x-2 items-center justify-start'>
            <span className='bg-blue-50 font-semibold p-0.5 rounded-sm border text-xs'>
              {getDocumentTypeFromMime(document.document_type)}
            </span>
            <p>{document.original_name}</p>
          </div>
          <div className='flex items-center text-xs text-gray-500'>
            <time>
              {formatDistanceToNowStrict(new Date(document.upload_date), {
                addSuffix: true,
              })}
            </time>
            <span className='mx-2'>•</span>
            <span>{formatFileSize(document.document_size)}</span>
          </div>
        </div>
        <div className='flex items-center space-x-1 flex-shrink-0'>
          <Button
            className='p-2'
            asChild
            variant='ghost'
            size='sm'
            aria-label='View document'
          >
            <Link href={`/document/${document.document_id}`}>
              <Eye size={16} />
            </Link>
          </Button>
          <Button
            className='p-2'
            variant='ghost'
            size='sm'
            aria-label='Document settings'
          >
            <MoreVertical size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
