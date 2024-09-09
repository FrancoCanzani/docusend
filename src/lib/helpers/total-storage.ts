import { FileMetadata } from '../types';

export function totalStorage(data: FileMetadata[]): number {
  if (!data || data.length === 0) {
    return 0;
  }

  const totalBytes = data.reduce((total, file) => {
    const fileSize = typeof file.file_size === 'number' ? file.file_size : 0;
    return total + fileSize;
  }, 0);

  // Convert bytes to MB and round to 2 decimal places
  return Number((totalBytes / (1024 * 1024)).toFixed(2));
}
