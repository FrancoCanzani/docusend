'use client';

import React, { useMemo } from 'react';
import getCountryData from '@/lib/helpers/get-country-data';
import { DocumentView } from '@/app/document/[documentId]/columns';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  SortingState,
  getSortedRowModel,
} from '@tanstack/react-table';

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
        <Table>
          <TableHeader className='bg-gray-100'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className='h-10'>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className='hover:bg-gray-50'
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className='py-2.5'>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className='text-center'>
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
