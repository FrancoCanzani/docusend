'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DocumentMetadata as DocumentMetadataType } from '@/lib/types';
import {
  SquareArrowOutUpRight,
  Settings2,
  Calendar,
  Upload,
  Clock,
  FileText,
  HardDrive,
} from 'lucide-react';
import Link from 'next/link';
import DocumentSettingsSheet from '@/components/document-settings-sheet';
import { formatDistanceToNow, format, isAfter, subMonths } from 'date-fns';

type DocumentMetadataProps = {
  documentMetadata: DocumentMetadataType;
};

export default function DocumentMetadata({
  documentMetadata,
}: DocumentMetadataProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const threeMonthsAgo = subMonths(new Date(), 3);

    if (isAfter(date, threeMonthsAgo)) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, 'MMM d, yyyy');
    }
  };

  const formatDocumentSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <section className='w-full space-y-4 sm:space-y-6'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl sm:text-2xl font-bold truncate mr-2'>
          {documentMetadata.original_name}
        </h1>
        <div className='flex space-x-1 flex-shrink-0'>
          <Link
            href={`/view/${documentMetadata.document_id}`}
            title='Visit'
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
          >
            <SquareArrowOutUpRight size={18} />
            <span className='sr-only'>Visit</span>
          </Link>
          <DocumentSettingsSheet documentMetadata={documentMetadata}>
            <button
              className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
              title='Settings'
            >
              <span className='sr-only'>Settings</span>
              <Settings2 size={18} />
            </button>
          </DocumentSettingsSheet>
        </div>
      </div>

      <div className='flex flex-wrap items-center gap-3 sm:gap-5'>
        <div className='flex items-center space-x-2'>
          <FileText className='text-gray-500 flex-shrink-0' size={18} />
          <span className='font-medium'>
            {documentMetadata.document_type.split('/')[1].toUpperCase()}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <HardDrive className='text-gray-500 flex-shrink-0' size={18} />
          <span className='font-medium'>
            {formatDocumentSize(documentMetadata.document_size)}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <Upload className='text-gray-500 flex-shrink-0' size={18} />
          <span className='text-sm sm:text-base'>
            Uploaded {formatDate(documentMetadata.upload_date)}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <Clock className='text-gray-500 flex-shrink-0' size={18} />
          <span className='text-sm sm:text-base'>
            Modified {formatDate(documentMetadata.last_modified)}
          </span>
        </div>
      </div>

      {documentMetadata.is_expiring && documentMetadata.expiration_date && (
        <div className='flex items-center space-x-2'>
          <Calendar className='text-red-500 flex-shrink-0' size={18} />
          <span className='font-medium text-red-500 text-sm sm:text-base'>
            Expires {formatDate(documentMetadata.expiration_date)}
          </span>
        </div>
      )}

      <Separator />

      <div className='flex flex-wrap gap-2'>
        <Badge variant={documentMetadata.is_public ? 'default' : 'secondary'}>
          {documentMetadata.is_public ? 'Public' : 'Private'}
        </Badge>
        <Badge
          variant={documentMetadata.allow_download ? 'default' : 'secondary'}
        >
          {documentMetadata.allow_download ? 'Downloadable' : 'No Download'}
        </Badge>
        <Badge
          variant={documentMetadata.require_email ? 'default' : 'secondary'}
        >
          {documentMetadata.require_email ? 'Email Required' : 'No Email'}
        </Badge>
        <Badge
          variant={documentMetadata.require_password ? 'default' : 'secondary'}
        >
          {documentMetadata.require_password
            ? 'Password Protected'
            : 'No Password'}
        </Badge>
        <Badge
          variant={documentMetadata.enable_feedback ? 'default' : 'secondary'}
        >
          {documentMetadata.enable_feedback
            ? 'Feedback Enabled'
            : 'No Feedback'}
        </Badge>
        <Badge variant={documentMetadata.require_nda ? 'default' : 'secondary'}>
          {documentMetadata.require_nda ? 'NDA Required' : 'No NDA'}
        </Badge>
        {documentMetadata.is_expiring && (
          <Badge variant='destructive'>Expiring</Badge>
        )}
      </div>
    </section>
  );
}
