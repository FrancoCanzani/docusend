import { Badge } from '@/components/ui/badge';
import { FileMetadata as FileMetadataType } from '@/lib/types';

type FileMetadataProps = {
  fileMetadata: FileMetadataType;
};

export default function FileMetadata({ fileMetadata }: FileMetadataProps) {
  const formatDate = (dateString: string | null) => {
    return dateString ? new Date(dateString).toLocaleString() : 'N/A';
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(2)} ${units[unitIndex]}`;
  };

  return (
    <section className='space-y-4'>
      <div>
        <h1 className='text-xl font-semibold'>{fileMetadata.original_name}</h1>
      </div>
      <div className='flex justify-between'>
        <div>
          <h3 className='font-semibold'>File Size</h3>
          <p>{formatFileSize(fileMetadata.file_size)}</p>
        </div>
        <div>
          <h3 className='font-semibold'>File Type</h3>
          <p className='uppercase'>{fileMetadata.file_type.split('/')[1]}</p>
        </div>
      </div>
      <div className='flex justify-between'>
        <div>
          <h3 className='font-semibold'>Upload Date</h3>
          <p>{formatDate(fileMetadata.upload_date)}</p>
        </div>
        <div>
          <h3 className='font-semibold'>Last Modified</h3>
          <p>{formatDate(fileMetadata.last_modified)}</p>
        </div>
      </div>
      {fileMetadata.is_expiring && fileMetadata.expiration_date && (
        <div>
          <h3 className='font-semibold'>Expiration Date</h3>
          <p>{formatDate(fileMetadata.expiration_date)}</p>
        </div>
      )}
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
