export const getDocumentTypeFromMIME = (mimeType: string): string => {
  // Split the MIME type by '/'
  const parts = mimeType.split('/');

  // If there's no '/' in the string, return the original string
  if (parts.length === 1) return mimeType;

  // Get the last part (which should be the document type)
  let documentType = parts[parts.length - 1];

  // Special handling for some MIME types
  if (documentType.startsWith('vnd.')) {
    // For types like 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const subParts = documentType.split('.');
    documentType = subParts[subParts.length - 1];
  }

  return documentType;
};
