'use client';

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
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { X, Upload, AlertCircle, File } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

interface DocumentUploadDialogProps {
  folderId: string | null;
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

function getDocumentType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'xls':
    case 'xlsx':
      return 'Excel';
    case 'csv':
      return 'CSV';
    case 'ods':
      return 'OpenDocument Spreadsheet';
    case 'pdf':
      return 'PDF';
    default:
      return 'Unknown';
  }
}

export default function DocumentUploadDialog({
  folderId,
}: DocumentUploadDialogProps) {
  const [documentName, setDocumentName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (file && documentName) {
      setIsUploading(true);
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        toast.error('User not authenticated');
        setIsUploading(false);
        return;
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 15)}.${fileExt}`;
      const filePath = `${authData.user.id}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (error) {
        console.error('Error uploading file:', error);
        toast.error('Error uploading file. Please try again.');
        setIsUploading(false);
        return;
      }

      const documentType = getDocumentType(file.name);

      const { error: documentError } = await supabase
        .from('document_metadata')
        .insert([
          {
            user_id: authData.user.id,
            document_id: uuidv4(),
            original_name: documentName,
            sanitized_name: documentName,
            document_path: data.path,
            document_size: file.size,
            folder_id: folderId,
            document_type: documentType,
            last_modified: new Date().toISOString(),
          },
        ]);

      if (documentError) {
        console.error('Error creating document metadata:', documentError);
        toast.error('Error saving document information. Please try again.');
      } else {
        toast.success('Document uploaded successfully');
        router.refresh();
        setIsOpen(false);
      }
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size='sm' variant='outline'>
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            Add New Document
          </DialogTitle>
          <DialogDescription>
            Upload a new document to your DocuSend account.
            <span className='font-semibold text-black'>
              {folderId
                ? ' The document will be uploaded to the selected folder.'
                : ' The document will be uploaded to the root folder.'}
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='documentName'>Document Name</Label>
            <Input
              id='documentName'
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder='Enter document name'
              className='w-full'
            />
          </div>
          <div
            {...getRootProps()}
            className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            {file ? (
              <div className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <File className='w-4 h-4 text-primary mr-3' />
                  <span className='text-sm font-medium'>{file.name}</span>
                </div>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={(e) => {
                    e.stopPropagation();
                    setFile(null);
                    setError(null);
                    setDocumentName('');
                  }}
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
            ) : (
              <div className='flex flex-col items-center'>
                <Upload className='w-6 h-6 text-muted-foreground mb-3' />
                <p className='text-sm font-medium mb-1'>
                  Drag & drop a file here, or click to select a file
                </p>
                <p className='text-xs text-muted-foreground'>
                  Supported files: XLS, XLSX, CSV, ODS, PDF (max 50 MB)
                </p>
              </div>
            )}
          </div>
          {error && (
            <Alert variant='destructive'>
              <AlertCircle className='w-4 h-4' />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              type='submit'
              disabled={!file || !documentName || isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
