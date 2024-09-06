import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { X, Upload } from 'lucide-react';

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, name: string) => void;
}

export function FileUploadDialog({
  isOpen,
  onClose,
  onUpload,
}: FileUploadDialogProps) {
  const [documentName, setDocumentName] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        if (!documentName) {
          setDocumentName(acceptedFiles[0].name);
        }
      }
    },
    [documentName]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file && documentName) {
      onUpload(file, documentName);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
          <DialogDescription>
            Upload a new document to your DocuSend account.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <Label htmlFor='documentName'>Document Name</Label>
            <Input
              id='documentName'
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder='Enter document name'
            />
          </div>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-md p-4 text-center cursor-pointer ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className='flex items-center justify-between'>
                <span>{file.name}</span>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                  }}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <Upload className='h-10 w-10 text-gray-400 mb-2' />
                <p>Drag & drop a file here, or click to select a file</p>
              </div>
            )}
          </div>
          <Button
            type='submit'
            className='w-full'
            disabled={!file || !documentName}
          >
            Upload Document
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
