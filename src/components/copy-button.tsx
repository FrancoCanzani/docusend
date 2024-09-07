import { copyToClipboard } from '@/lib/helpers/copy-to-clipboard';
import { useState } from 'react';
import { Copy, X, Check } from 'lucide-react';

export default function CopyButton({ documentId }: { documentId: string }) {
  const [copyStatus, setCopyStatus] = useState('idle');

  const handleCopyToClipboard = async () => {
    try {
      const success = await copyToClipboard(`${documentId}`);
      if (success) {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } else {
        throw new Error('Copy failed');
      }
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  return (
    <button
      onClick={handleCopyToClipboard}
      className='p-1 bg-gray-100 border hover:bg-gray-200 rounded-sm'
    >
      <span className='sr-only'>Copy</span>
      {copyStatus === 'copied' ? (
        <Check size={14} />
      ) : copyStatus === 'error' ? (
        <X size={14} />
      ) : (
        <Copy size={14} />
      )}
    </button>
  );
}
