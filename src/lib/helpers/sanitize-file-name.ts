export default function sanitizeFilename(filename: string): string {
  const sanitized = filename.replace(/[^\x00-\x7F]/g, '').replace(/\s+/g, '_');
  const parts = sanitized.split('.');
  if (parts.length > 2 && parts[parts.length - 1] === parts[parts.length - 2]) {
    parts.pop();
  }
  return parts.join('.');
}
