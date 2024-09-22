'use client';

import React from 'react';
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { columns, FileView } from '@/app/file/[fileId]/columns';

type FileViewsProps = {
  fileViews: FileView[];
};

export default function FileViews({ fileViews }: FileViewsProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [countryFilter, setCountryFilter] = React.useState<string | null>(null);

  const table = useReactTable({
    data: fileViews,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  // Get unique countries for the filter dropdown
  const uniqueCountries = React.useMemo(() => {
    const countries = new Set<string>();
    fileViews.forEach((view) => {
      if (view.properties.$geoip_country_name) {
        countries.add(view.properties.$geoip_country_name);
      }
    });
    return Array.from(countries).sort();
  }, [fileViews]);

  React.useEffect(() => {
    if (countryFilter) {
      table
        .getColumn('properties.$geoip_country_name')
        ?.setFilterValue(countryFilter);
    } else {
      table
        .getColumn('properties.$geoip_country_name')
        ?.setFilterValue(undefined);
    }
  }, [countryFilter, table]);

  return (
    <div className='w-full text-black'>
      <div className='flex items-center pb-4 space-x-3'>
        <Input
          placeholder='Filter by email...'
          value={
            (table.getColumn('properties.email')?.getFilterValue() as string) ??
            ''
          }
          onChange={(event) =>
            table
              .getColumn('properties.email')
              ?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <Select
          value={countryFilter ?? 'all'}
          onValueChange={(value) =>
            setCountryFilter(value === 'all' ? null : value)
          }
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Filter by country' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Countries</SelectItem>
            {uniqueCountries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
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
                    <TableCell key={cell.id}>
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
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex items-center justify-between'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className='h-8 w-[70px]'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center justify-end space-x-2 py-4'>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
