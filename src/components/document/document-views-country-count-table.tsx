'use client';

import React, { useMemo } from 'react';
import getCountryData from '@/lib/helpers/get-country-data';
import { DocumentView } from '@/app/(dashboard)/document/[documentId]/columns';
import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';
import { DataTable } from '../ui/data-table';

type CountryViewCountTableProps = {
  documentViews: DocumentView[];
};

type CountryViewData = {
  country: string;
  count: number;
};

export default function DocumentViewsCountryCountTable({
  documentViews,
}: CountryViewCountTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);

  const countryData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    documentViews.forEach((view) => {
      if (view.country && view.country !== 'MOCKCOUNTRY') {
        const countryInfo = getCountryData(view.country);
        if (countryInfo) {
          const countryName = countryInfo.countryNameEn;
          counts[countryName] = (counts[countryName] || 0) + 1;
        }
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1]) // Sort by count in descending order
      .map(([country, count]) => ({ country, count }));
  }, [documentViews]);

  const columns: ColumnDef<CountryViewData>[] = [
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
    },
    {
      accessorKey: 'count',
      header: ({ column }) => (
        <button
          className='font-bold'
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          View Count
        </button>
      ),
    },
  ];

  const table = useReactTable({
    data: countryData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className='w-full text-black'>
      <div className='rounded-md border'>
        <DataTable columns={columns} table={table} />
      </div>
    </div>
  );
}
