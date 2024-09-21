'use client';

import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatDistanceToNowStrict } from 'date-fns';

export type FileView = {
  id: string;
  distinct_id: string;
  properties: {
    $browser?: string;
    $os?: string;
    $device_type?: string;
    $current_url?: string;
    email?: string | null;
    $time?: number;
    $geoip_country_name?: string;
  };
  event: string;
  timestamp: string;
};

export const columns: ColumnDef<FileView>[] = [
  {
    accessorKey: 'properties.email',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => row.original.properties.email ?? 'Anonymous',
  },
  {
    accessorKey: 'properties.$device_type',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Device Type
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => row.original.properties.$device_type ?? 'Unknown',
  },
  {
    accessorKey: 'properties.$browser',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Browser
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => row.original.properties.$browser ?? 'Unknown',
  },
  {
    accessorKey: 'properties.$os',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          OS
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => row.original.properties.$os ?? 'Unknown',
  },
  {
    accessorKey: 'properties.$time',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Time
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.original.properties.$time;
      if (timestamp) {
        const date = new Date(timestamp * 1000);
        return formatDistanceToNowStrict(date);
      }
      return 'Unknown';
    },
  },
  {
    accessorKey: 'properties.$geoip_country_name',
    header: ({ column }) => {
      return (
        <Button
          variant='ghost'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Country
          <ArrowUpDown className='ml-2 h-4 w-4' />
        </Button>
      );
    },
    cell: ({ row }) => row.original.properties.$geoip_country_name ?? 'Unknown',
  },
];
