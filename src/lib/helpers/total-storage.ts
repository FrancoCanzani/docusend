import { DocumentMetadata } from '../types';

export function totalStorage(data: DocumentMetadata[]): number {
  if (!data || data.length === 0) {
    return 0;
  }

  const totalBytes = data.reduce((total, document) => {
    const documentSize =
      typeof document.document_size === 'number' ? document.document_size : 0;
    return total + documentSize;
  }, 0);

  // Convert bytes to MB and round to 2 decimal places
  return Number((totalBytes / (1024 * 1024)).toFixed(2));
}
