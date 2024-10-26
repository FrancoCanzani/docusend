'use client';

import React from 'react';
import {
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { columns, DocumentView } from '@/app/document/[documentId]/columns';
import { useRouter } from 'next/navigation';
import { DataTable } from '../ui/data-table';
import { DataTablePagination } from '../ui/data-table-pagination';

type DocumentViewsProps = {
  documentViews: DocumentView[];
};

export default function DocumentViewsTable({
  documentViews,
}: DocumentViewsProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();

  const table = useReactTable({
    data: documentViews,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className='w-full text-black'>
      <div className='flex items-center pb-4 space-x-3'>
        <Input
          placeholder='Filter by email...'
          value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('email')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <Button variant={'outline'} onClick={() => router.refresh()}>
          Refresh data
        </Button>
      </div>
      <div className='rounded-md border'>
        <DataTable columns={columns} table={table} />
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}
