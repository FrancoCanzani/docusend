export function getDocumentTypeFromMime(mimeType: string): string {
  const [type, subtype] = mimeType.split('/');

  switch (type) {
    case 'application':
      switch (subtype) {
        case 'pdf':
          return 'PDF';
        case 'msword':
        case 'vnd.openxmlformats-officedocument.wordprocessingml.document':
          return 'Word';
        case 'vnd.ms-excel':
        case 'vnd.openxmlformats-officedocument.spreadsheetml.sheet':
          return 'Excel';
        case 'vnd.ms-powerpoint':
        case 'vnd.openxmlformats-officedocument.presentationml.presentation':
          return 'PowerPoint';
        case 'zip':
        case 'x-rar-compressed':
          return 'Archive';
        default:
          return 'Document';
      }
    case 'text':
      return 'Text';
    case 'image':
      return 'Image';
    case 'audio':
      return 'Audio';
    case 'video':
      return 'Video';
    default:
      return 'Other';
  }
}
