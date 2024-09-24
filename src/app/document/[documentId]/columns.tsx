'use client';
import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNowStrict, format, parseISO } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export type DocumentView = {
  id: string;
  distinct_id: string;
  email: string | null;
  browser: string;
  device_type: string;
  timestamp: string;
  country: string;
  duration: number;
};

export const columns: ColumnDef<DocumentView>[] = [
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <button
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Email
      </button>
    ),
    cell: ({ row }) => (
      <div className='font-medium'>{row.getValue('email') ?? 'Anonymous'}</div>
    ),
  },
  {
    accessorKey: 'device_type',
    header: ({ column }) => (
      <button
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Device Type
      </button>
    ),
    cell: ({ row }) => <div>{row.getValue('device_type') ?? 'Unknown'}</div>,
  },
  {
    accessorKey: 'browser',
    header: ({ column }) => (
      <button
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Browser
      </button>
    ),
    cell: ({ row }) => <div>{row.getValue('browser') ?? 'Unknown'}</div>,
  },
  {
    accessorKey: 'timestamp',
    header: ({ column }) => (
      <button
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Registered
      </button>
    ),
    cell: ({ row }) => {
      const timestamp = row.getValue('timestamp') as string;
      const date = parseISO(timestamp);
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
    accessorKey: 'country',
    header: ({ column }) => (
      <button
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Country
      </button>
    ),
    cell: ({ row }) => <div>{row.getValue('country') ?? 'Unknown'}</div>,
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => (
      <button
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Duration
      </button>
    ),
    cell: ({ row }) => <div>{`${row.getValue('duration')} seconds`}</div>,
  },
];
