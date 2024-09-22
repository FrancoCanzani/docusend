'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Settings2, FileType, FileText, FileSpreadsheet } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { DocumentMetadata } from '@/lib/types';
import { format, formatDistanceToNowStrict, isValid, parseISO } from 'date-fns';
import { getDocumentTypeFromMIME } from '@/lib/helpers/get-document-type';
import Link from 'next/link';
import DocumentSettingsSheet from '@/components/document-settings-sheet';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const FILE_TYPE_MAP: {
  [key: string]: { label: string; icon: React.ReactNode };
} = {
  pdf: { label: 'PDF', icon: <FileText size={16} /> },
  excel: { label: 'XLS', icon: <FileSpreadsheet size={16} /> },
  sheet: { label: 'XLSX', icon: <FileSpreadsheet size={16} /> },
  csv: { label: 'CSV', icon: <FileText size={16} /> },
  spreadsheet: { label: 'ODS', icon: <FileSpreadsheet size={16} /> },
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
    accessorKey: 'original_name',
    header: 'Document Name',
    cell: ({ row }) => (
      <Link
        href={`/document/${row.original.document_id}`}
        className='font-medium max-w-36 truncate'
        title={row.getValue('original_name')}
      >
        {row.getValue('original_name')}
      </Link>
    ),
  },
  {
    accessorKey: 'document_type',
    header: 'Type',
    cell: ({ row }) => {
      const mimeType = row.getValue('document_type');
      if (typeof mimeType !== 'string') {
        return <div>Unknown</div>;
      }
      const documentType = getDocumentTypeFromMIME(mimeType);
      const { label, icon } = FILE_TYPE_MAP[documentType] || {
        label: documentType.toUpperCase(),
        icon: <FileType size={16} />,
      };
      return (
        <div className='flex items-center space-x-2'>
          {icon}
          <span>{label}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'upload_date',
    header: 'Uploaded',
    cell: ({ row }) => {
      const uploadDate = row.getValue('upload_date');
      if (typeof uploadDate !== 'string') return <span>Invalid date</span>;
      const date = parseISO(uploadDate);
      if (!isValid(date)) return <span>Invalid date</span>;
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <time>
                {formatDistanceToNowStrict(date, { addSuffix: true })}
              </time>
            </TooltipTrigger>
            <TooltipContent>
              <p>{format(date, 'PPP')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'is_public',
    header: 'Visibility',
    cell: ({ row }) => (
      <Badge variant={row.original.is_public ? 'default' : 'secondary'}>
        {row.original.is_public ? 'Public' : 'Private'}
      </Badge>
    ),
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
