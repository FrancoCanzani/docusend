'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNowStrict } from 'date-fns';

export type DocumentView = {
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

export const columns: ColumnDef<DocumentView>[] = [
  {
    id: 'properties.email',
    accessorKey: 'properties.email',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Email
        </button>
      );
    },
    cell: ({ row }) => row.original.properties.email ?? 'Anonymous',
  },
  {
    id: 'properties.$device_type',
    accessorKey: 'properties.$device_type',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Device Type
        </button>
      );
    },
    cell: ({ row }) => row.original.properties.$device_type ?? 'Unknown',
  },
  {
    id: 'properties.$browser',
    accessorKey: 'properties.$browser',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Browser
        </button>
      );
    },
    cell: ({ row }) => row.original.properties.$browser ?? 'Unknown',
  },
  {
    id: 'properties.$time',
    accessorKey: 'properties.$time',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Registered
        </button>
      );
    },
    cell: ({ row }) => {
      const timestamp = row.original.properties.$time;
      if (timestamp) {
        const date = new Date(timestamp * 1000);
        return formatDistanceToNowStrict(date, {
          addSuffix: true,
        });
      }
      return 'Unknown';
    },
  },
  {
    id: 'properties.$geoip_country_name',
    accessorKey: 'properties.$geoip_country_name',
    header: ({ column }) => {
      return (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Country
        </button>
      );
    },
    cell: ({ row }) => row.original.properties.$geoip_country_name ?? 'Unknown',
  },
];
