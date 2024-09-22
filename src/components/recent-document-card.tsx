import { formatDistanceToNow } from 'date-fns';
import getFileSize from '@/lib/helpers/get-file-size';
import { FileText } from 'lucide-react';
import { DocumentMetadata } from '@/lib/types';
import Link from 'next/link';

export default function RecentDocumentCard({
  document,
}: {
  document: DocumentMetadata;
}) {
  return (
    <Link
      href={`/document/${document.document_id}`}
      className='flex w-full h-full items-center justify-start space-x-2 border rounded-md bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow p-2.5'
    >
      <FileText size={40} className='p-2 bg-gray-100 rounded-md' />
      <div className='flex flex-col'>
        <p className='font-medium'>{document.sanitized_name}</p>
        <div className='text-xs text-muted-foreground flex items-center justify-normal gap-x-2'>
          {getFileSize(document.document_size)}
          <p>
            {formatDistanceToNow(new Date(document.upload_date), {
              addSuffix: true,
            })}
          </p>
        </div>
      </div>
    </Link>
  );
}
