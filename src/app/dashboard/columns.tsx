'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { FileMetadata } from '@/lib/types';
import { format } from 'date-fns';
import { getFileTypeFromMIME } from '@/lib/helpers/get-file-type';
import CopyButton from '@/components/copy-button';
import Link from 'next/link';
import DocumentSettingsSheet from '@/components/document-settings-sheet';

const FILE_TYPE_MAP: { [key: string]: string } = {
  pdf: 'PDF',
  excel: 'XLS',
  sheet: 'XLSX',
  csv: 'CSV',
  spreadsheet: 'ODS',
};

export const columns: ColumnDef<FileMetadata>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center h-full'>
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center h-full'>
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
    accessorKey: 'file_type',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='hover:bg-transparent flex items-center justify-start'
        >
          Type
          <ArrowUpDown className='ml-2 h-3 w-3' />
        </button>
      );
    },
    cell: ({ row }) => {
      const mimeType = row.getValue('file_type');
      if (typeof mimeType !== 'string') {
        return <div>Unknown</div>;
      }
      const fileType = getFileTypeFromMIME(mimeType);
      const displayType = FILE_TYPE_MAP[fileType] || fileType.toUpperCase();
      return (
        <span className='border bg-gray-100 hover:bg-gray-200 font-semibold text-xs px-2 py-1 rounded-sm'>
          {displayType}
        </span>
      );
    },
  },
  {
    accessorKey: 'original_name',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='hover:bg-transparent flex items-center justify-start'
        >
          File Name
          <ArrowUpDown className='ml-2 h-3 w-3' />
        </button>
      );
    },
    cell: ({ row }) => (
      <Link
        href={`/file/${row.original.file_id}`}
        className='font-medium max-w-44 truncate'
        title={row.getValue('original_name')}
      >
        {row.getValue('original_name')}
      </Link>
    ),
  },
  {
    accessorKey: 'file_id',
    header: () => {
      return <span className='hover:bg-transparent'>Share</span>;
    },
    cell: ({ row }) => <CopyButton documentId={row.getValue('file_id')} />,
  },
  {
    accessorKey: 'file_size',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='hover:bg-transparent flex items-center justify-start'
        >
          Size
          <ArrowUpDown className='ml-2 h-3 w-3' />
        </button>
      );
    },
    cell: ({ row }) => {
      const sizeInBytes = parseFloat(row.getValue('file_size'));
      let sizeInMB = sizeInBytes / (1024 * 1024);
      let unit = 'MB';

      if (sizeInMB >= 1000) {
        sizeInMB /= 1024;
        unit = 'GB';
      }

      const formatted = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(sizeInMB);

      return (
        <div className='font-medium'>
          {formatted} {unit}
        </div>
      );
    },
  },
  {
    accessorKey: 'upload_date',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className='hover:bg-transparent min-w-[6.2rem] flex items-center justify-start'
        >
          Upload Date
          <ArrowUpDown className='ml-2 h-3 w-3' />
        </button>
      );
    },
    cell: ({ row }) => {
      return (
        <time suppressHydrationWarning>
          {format(
            new Date(row.getValue('upload_date')).toLocaleString(),
            'MM/dd/yyyy'
          )}
        </time>
      );
    },
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const file = row.original;

      return <DocumentSettingsSheet file={file} />;
    },
  },
];
