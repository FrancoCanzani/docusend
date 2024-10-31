'use client';

import { ColumnDef } from '@tanstack/react-table';
import { formatDistanceToNowStrict, format, parseISO } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import getCountryData from '@/lib/helpers/get-country-data';
import { decodeCityName } from '@/lib/helpers/decode-city-name';

export type DocumentView = {
  id: string;
  email: string | null;
  document_id: string;
  pathname: string;
  browser: string;
  device_type: string;
  timestamp: string;
  duration: number;
  created_at: string;
  ip: string;
  city: string;
  country: string;
  country_region: string;
  latitude: number;
  longitude: number;
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
        Device
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
    accessorKey: 'city',
    header: ({ column }) => (
      <button
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        City
      </button>
    ),
    cell: ({ row }) => (
      <div>
        {decodeCityName(row.getValue('city')) ??
          row.getValue('city') ??
          'Unknown'}
      </div>
    ),
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
    cell: ({ row }) => {
      const countryCode = row.getValue('country') as string;
      const country = getCountryData(countryCode);
      return (
        <div className='space-x-1'>
          {country?.flag && <span>{country?.flag}</span>}
          <span>{country?.countryNameEn ?? countryCode ?? 'Unknown'}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'region',
    accessorFn: (row) => {
      const country = getCountryData(row.country);
      return country?.region ?? 'Unknown';
    },
    header: ({ column }) => (
      <button
        className='font-bold'
        onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      >
        Region
      </button>
    ),
    cell: ({ getValue }) => {
      return (
        <div className='space-x-1'>
          <span>{getValue() as string}</span>
        </div>
      );
    },
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
];
