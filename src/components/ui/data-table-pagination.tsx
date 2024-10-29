'use client';

import * as React from 'react';
import { Table as TableType } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';

interface DataTablePaginationProps<TData> {
  table: TableType<TData>;
  totalRows?: number;
  showRowCount?: boolean;
}

export function DataTablePagination<TData>({
  table,
  totalRows,
  showRowCount = true,
}: DataTablePaginationProps<TData>) {
  return (
    <div className='flex items-center justify-end space-x-2 pb-4'>
      {showRowCount && (
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel?.() ? (
            <>
              {table.getFilteredSelectedRowModel().rows.length} of{' '}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </>
          ) : (
            <>
              {totalRows ?? table.getFilteredRowModel().rows.length} row(s)
              total.
            </>
          )}
        </div>
      )}
      <div className='space-x-2'>
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
  );
}
