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
import { X, Upload, AlertCircle, FilePlus } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ScrollArea } from '../ui/scroll-area';

interface DocumentUploadDialogProps {
  folderId: string | null;
}

interface FileWithName {
  file: File;
  customName: string;
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

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB

export default function DocumentUploadDialog({
  folderId,
}: DocumentUploadDialogProps) {
  const [files, setFiles] = useState<FileWithName[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      const newFiles = acceptedFiles.map((file) => ({
        file,
        customName: file.name,
      }));
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);

      const newErrors = fileRejections.map((rejection) => {
        if (rejection.errors[0]?.code === 'file-invalid-type') {
          return `${rejection.file.name}: Invalid file type. Please upload XLS, XLSX, CSV, ODS, or PDF files only.`;
        } else if (rejection.errors[0]?.code === 'file-too-large') {
          return `${rejection.file.name}: File is too large. Maximum size is 50 MB.`;
        } else {
          return `${rejection.file.name}: Error uploading file. Please try again.`;
        }
      });

      setErrors((prevErrors) => [...prevErrors, ...newErrors]);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPTED_FILE_TYPES,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
  });

  const removeFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleNameChange = (index: number, newName: string) => {
    setFiles((prevFiles) =>
      prevFiles.map((fileWithName, i) =>
        i === index ? { ...fileWithName, customName: newName } : fileWithName
      )
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (files.length > 0) {
      setIsUploading(true);
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) {
        toast.error('User not authenticated');
        setIsUploading(false);
        return;
      }

      for (const fileWithName of files) {
        const { file, customName } = fileWithName;
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
          toast.error(`Error uploading ${customName}. Please try again.`);
          continue;
        }

        const { error: documentError } = await supabase
          .from('document_metadata')
          .insert([
            {
              user_id: authData.user.id,
              document_id: uuidv4(),
              original_name: file.name,
              sanitized_name: customName,
              document_path: data.path,
              document_size: file.size,
              folder_id: folderId,
              document_type: file.type,
              last_modified: new Date().toISOString(),
            },
          ]);

        if (documentError) {
          console.error('Error creating document metadata:', documentError);
          toast.error(
            `Error saving information for ${customName}. Please try again.`
          );
        } else {
          toast.success(`${customName} uploaded successfully`);
        }
      }

      router.refresh();
      setIsOpen(false);
      setIsUploading(false);
      setFiles([]);
      setErrors([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} variant={'outline'}>
          <FilePlus size={22} className='sm:hidden' />
          <span className='hidden sm:block'>Upload Documents</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[500px]'>
        <DialogHeader>
          <DialogTitle className='flex items-center'>
            Add New Documents
          </DialogTitle>
          <DialogDescription>
            Upload new documents to your DocuSend account.
            <span className='font-semibold text-black'>
              {folderId
                ? ' The documents will be uploaded to the selected folder.'
                : ' The documents will be uploaded to the root folder.'}
            </span>
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div
            {...getRootProps()}
            className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors duration-200 ${
              isDragActive
                ? 'border-primary bg-primary/5'
                : 'border-muted hover:border-primary/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className='flex flex-col items-center'>
              <Upload className='w-6 h-6 text-muted-foreground mb-3' />
              <p className='text-sm font-medium mb-1'>
                Drag & drop files here, or click to select files
              </p>
              <p className='text-xs text-muted-foreground'>
                Supported files: XLS, XLSX, CSV, ODS, PDF (max 50 MB each)
              </p>
            </div>
          </div>
          {files.length > 0 && (
            <div className='space-y-2'>
              <Label className='font-bold'>Selected Files</Label>
              <ScrollArea className='h-[250px]'>
                {files.map((fileWithName, index) => (
                  <div
                    key={index}
                    className='flex items-center my-1 justify-between bg-gray-50/50 p-2 rounded'
                  >
                    <div className='flex items-center flex-grow mr-2'>
                      <Input
                        value={fileWithName.customName}
                        onChange={(e) =>
                          handleNameChange(index, e.target.value)
                        }
                        className='text-sm font-medium'
                      />
                    </div>
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      onClick={() => removeFile(index)}
                    >
                      <X className='w-4 h-4' />
                    </Button>
                  </div>
                ))}
              </ScrollArea>
            </div>
          )}

          {errors.length > 0 && (
            <Alert variant='destructive'>
              <AlertCircle className='w-4 h-4' />
              <AlertDescription>
                <ul>
                  {errors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button type='submit' disabled={files.length === 0 || isUploading}>
              {isUploading ? 'Uploading...' : 'Upload Documents'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
