import React, { useState, useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
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
import { X, Upload, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File, name: string) => void;
}

const ACCEPTED_FILE_TYPES = {
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': [
    '.xlsx',
  ],
  'text/csv': ['.csv'],
  'application/vnd.oasis.opendocument.spreadsheet': ['.ods'],
  'application/pdf': ['.pdf'],
};

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

export function DocumentUploadDialog({
  isOpen,
  onClose,
  onUpload,
}: DocumentUploadDialogProps) {
  const [documentName, setDocumentName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0]);
        setDocumentName(acceptedFiles[0].name);
        setError(null);
      } else if (fileRejections.length > 0) {
        const rejection = fileRejections[0];
        if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError(
            'Invalid file type. Please upload XLS, XLSX, CSV, ODS, or PDF files only.'
          );
        } else if (rejection.errors[0]?.code === 'file-too-large') {
          setError('File is too large. Maximum size is 50 MB.');
        } else {
          setError('Error uploading file. Please try again.');
        }
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: false,
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file && documentName) {
      onUpload(file, documentName);
      onClose();
    }
  };

  const handleClose = () => {
    setDocumentName('');
    setFile(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Document</DialogTitle>
          <DialogDescription>
            Upload a new document to your DocuSend account. Supported file
            types: XLS, XLSX, CSV, ODS, PDF. Maximum file size: 50 MB.
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
                    setError(null);
                  }}
                >
                  <X className='h-4 w-4' />
                </Button>
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <Upload className='h-10 w-10 text-gray-400 mb-2' />
                <p>Drag & drop a file here, or click to select a file</p>
                <p className='text-sm text-gray-500 mt-1'>
                  Supported files: XLS, XLSX, CSV, ODS, PDF (max 50 MB)
                </p>
              </div>
            )}
          </div>
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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
