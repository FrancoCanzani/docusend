'use client';

import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileMetadata as FileMetadataType } from '@/lib/types';
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

type FileMetadataProps = {
  fileMetadata: FileMetadataType;
};

export default function FileMetadata({ fileMetadata }: FileMetadataProps) {
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

  const formatFileSize = (bytes: number) => {
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
          {fileMetadata.original_name}
        </h1>
        <div className='flex space-x-1 flex-shrink-0'>
          <Link
            href={`/view/${fileMetadata.file_id}`}
            title='Visit'
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200'
          >
            <SquareArrowOutUpRight size={18} />
            <span className='sr-only'>Visit</span>
          </Link>
          <DocumentSettingsSheet fileMetadata={fileMetadata}>
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
            {fileMetadata.file_type.split('/')[1].toUpperCase()}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <HardDrive className='text-gray-500 flex-shrink-0' size={18} />
          <span className='font-medium'>
            {formatFileSize(fileMetadata.file_size)}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <Upload className='text-gray-500 flex-shrink-0' size={18} />
          <span className='text-sm sm:text-base'>
            Uploaded {formatDate(fileMetadata.upload_date)}
          </span>
        </div>
        <div className='flex items-center space-x-2'>
          <Clock className='text-gray-500 flex-shrink-0' size={18} />
          <span className='text-sm sm:text-base'>
            Modified {formatDate(fileMetadata.last_modified)}
          </span>
        </div>
      </div>

      {fileMetadata.is_expiring && fileMetadata.expiration_date && (
        <div className='flex items-center space-x-2'>
          <Calendar className='text-red-500 flex-shrink-0' size={18} />
          <span className='font-medium text-red-500 text-sm sm:text-base'>
            Expires {formatDate(fileMetadata.expiration_date)}
          </span>
        </div>
      )}

      <Separator />

      <div className='flex flex-wrap gap-2'>
        <Badge variant={fileMetadata.is_public ? 'default' : 'secondary'}>
          {fileMetadata.is_public ? 'Public' : 'Private'}
        </Badge>
        <Badge variant={fileMetadata.allow_download ? 'default' : 'secondary'}>
          {fileMetadata.allow_download ? 'Downloadable' : 'No Download'}
        </Badge>
        <Badge variant={fileMetadata.require_email ? 'default' : 'secondary'}>
          {fileMetadata.require_email ? 'Email Required' : 'No Email'}
        </Badge>
        <Badge
          variant={fileMetadata.require_password ? 'default' : 'secondary'}
        >
          {fileMetadata.require_password ? 'Password Protected' : 'No Password'}
        </Badge>
        <Badge variant={fileMetadata.enable_feedback ? 'default' : 'secondary'}>
          {fileMetadata.enable_feedback ? 'Feedback Enabled' : 'No Feedback'}
        </Badge>
        <Badge variant={fileMetadata.require_nda ? 'default' : 'secondary'}>
          {fileMetadata.require_nda ? 'NDA Required' : 'No NDA'}
        </Badge>
        {fileMetadata.is_expiring && (
          <Badge variant='destructive'>Expiring</Badge>
        )}
      </div>
    </section>
  );
}
