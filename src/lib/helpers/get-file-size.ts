export default function getFileSize(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  // Round to two decimal places
  const roundedSize = Math.round(size * 100) / 100;

  return `${roundedSize} ${units[unitIndex]}`;
}
