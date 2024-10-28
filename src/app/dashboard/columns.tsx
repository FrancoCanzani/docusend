import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, Settings2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DocumentMetadata, Folder } from '@/lib/types';
import { format, formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';
import { getDocumentTypeFromMime } from '@/lib/helpers/get-document-type';
import Link from 'next/link';
import DocumentSettingsSheet from '@/components/document/document-settings-sheet';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatFileSize } from '@/lib/helpers/format-file-size';

const renderSortIcon = (column: any) => {
  if (column.getIsSorted() === 'desc') {
    return <ArrowDown size={14} className='ml-1' />;
  } else if (column.getIsSorted() === 'asc') {
    return <ArrowUp size={14} className='ml-1' />;
  }
  return null;
};

export const columns: ColumnDef<DocumentMetadata>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-end justify-start'>
        <Checkbox
          className='p-0'
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-end justify-start'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'sanitized_name',
    header: ({ column }) => (
      <button
        className='font-bold flex items-center'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Name
        {renderSortIcon(column)}
      </button>
    ),
    cell: ({ row }) => {
      const mimeType = row.original.document_type;
      const documentType = getDocumentTypeFromMime(mimeType);

      return (
        <div className='font-medium flex items-end space-x-1'>
          <span className='uppercase font-bold'>{documentType}</span>
          <span>‧</span>
          <Link
            href={`/document/${row.original.document_id}`}
            className='max-w-lg truncate'
            title={row.getValue('sanitized_name')}
          >
            {row.getValue('sanitized_name')}
          </Link>
        </div>
      );
    },
  },
  {
    accessorKey: 'document_size',
    header: ({ column }) => (
      <button
        className='font-bold lg:flex items-center hidden'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Size
        {renderSortIcon(column)}
      </button>
    ),
    cell: ({ row }) => (
      <span className='hidden lg:block'>
        {formatFileSize(row.getValue('document_size'))}
      </span>
    ),
  },
  {
    accessorKey: 'upload_date',
    header: ({ column }) => (
      <button
        className='font-bold lg:flex items-center hidden'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Uploaded
        {renderSortIcon(column)}
      </button>
    ),
    cell: ({ row }) => {
      const uploadDate = row.getValue('upload_date');
      if (typeof uploadDate !== 'string') return <span>Invalid date</span>;
      const date = parseISO(uploadDate);
      if (!isValid(date)) return <span>Invalid date</span>;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <time className='hidden lg:block'>
                {formatDistanceToNowStrict(date, { addSuffix: true })}
              </time>
            </TooltipTrigger>
            <TooltipContent className='hidden lg:block'>
              <p>{format(date, 'PPP')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'is_public',
    header: ({ column }) => (
      <button
        className='font-bold flex items-center'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Visibility
        {renderSortIcon(column)}
      </button>
    ),
    cell: ({ row }) => (
      <Badge variant={row.original.is_public ? 'default' : 'secondary'}>
        {row.original.is_public ? 'Public' : 'Private'}
      </Badge>
    ),
  },
  {
    accessorKey: 'folder_id',
    header: ({ column }) => (
      <button
        className='font-bold items-center hidden lg:flex'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Folder
        {renderSortIcon(column)}
      </button>
    ),
    cell: ({ row, table }) => {
      const folderId = row.getValue('folder_id') as string | null;
      const folders = (table.options.meta as { folders: Folder[] }).folders;
      const folderName = folderId
        ? folders.find((f) => f.id === folderId)?.name || 'Unknown'
        : 'None';
      return <span className='hidden lg:block'>{folderName}</span>;
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const document = row.original;
      return (
        <DocumentSettingsSheet documentMetadata={document}>
          <button className='p-1 bg-gray-100 border hover:bg-gray-200 rounded-sm'>
            <span className='sr-only'>Settings</span>
            <Settings2 size={14} />
          </button>
        </DocumentSettingsSheet>
      );
    },
  },
];
