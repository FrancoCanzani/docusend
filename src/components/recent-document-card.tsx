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
      className='flex w-full h-full items-center justify-start space-x-2 border rounded-md bg-card text-card-foreground transition-colors duration-300 hover:bg-gray-50 p-2'
    >
      <div className='h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md'>
        <FileText size={17} />
      </div>
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
