export const getFileTypeFromMIME = (mimeType: string): string => {
  // Split the MIME type by '/'
  const parts = mimeType.split('/');

  // If there's no '/' in the string, return the original string
  if (parts.length === 1) return mimeType;

  // Get the last part (which should be the file type)
  let fileType = parts[parts.length - 1];

  // Special handling for some MIME types
  if (fileType.startsWith('vnd.')) {
    // For types like 'vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    const subParts = fileType.split('.');
    fileType = subParts[subParts.length - 1];
  }

  return fileType;
};
