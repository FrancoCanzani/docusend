'use client';

import * as React from 'react';
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { columns } from '@/app/dashboard/columns';
import { DocumentMetadata } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';

export default function DashboardTable({
  documentMetadata,
}: {
  documentMetadata: DocumentMetadata[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const supabase = createClient();

  const table = useReactTable({
    data: documentMetadata,
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

  const handleDeleteDocument = async (
    documentsToDelete: DocumentMetadata[]
  ) => {
    if (documentsToDelete.length === 0) {
      throw new Error('No documents selected for deletion');
    }

    // Delete documents from storage bucket
    const { error: bucketError } = await supabase.storage
      .from('documents')
      .remove(documentsToDelete.map((document) => document.document_path));

    if (bucketError) throw bucketError;

    // Delete metadata from database
    const { error: dbError } = await supabase
      .from('document_metadata')
      .delete()
      .in(
        'document_id',
        documentsToDelete.map((document) => document.document_id)
      );

    if (dbError) throw dbError;

    const documentWord =
      documentsToDelete.length === 1 ? 'document' : 'documents';
    return `Successfully deleted ${documentsToDelete.length} ${documentWord}.`;
  };

  const handleDeleteSelected = async () => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    const documentsToDelete = selectedRows.map((row) => row.original);

    if (documentsToDelete.length === 0) {
      toast.error('No documents selected for deletion');
      return;
    }

    const documentWord =
      documentsToDelete.length === 1 ? 'document' : 'documents';
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${documentsToDelete.length} ${documentWord}?`
    );

    if (!confirmDelete) return;

    toast.promise(handleDeleteDocument(documentsToDelete), {
      loading: `Deleting ${documentsToDelete.length} ${documentWord}...`,
      success: (message) => {
        window.location.reload();
        return message;
      },
      error: (error) => {
        console.error('Error deleting documents:', error);
        return `Failed to delete ${documentWord}. Please try again.`;
      },
    });
  };

  return (
    <div className='w-full text-black'>
      <div className='flex items-center py-4 space-x-3'>
        <Input
          placeholder='Filter documents...'
          value={
            (table.getColumn('original_name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('original_name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <Button
          variant='destructive'
          size='sm'
          onClick={handleDeleteSelected}
          className={cn(
            'flex items-center justify-center',
            table.getFilteredSelectedRowModel().rows.length === 0 && 'hidden'
          )}
        >
          <Trash2 className='mr-2' size={14} />
          Delete Selected
        </Button>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
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
      <div className='flex items-center justify-end space-x-2 py-4'>
        <div className='flex-1 text-sm text-muted-foreground'>
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
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
    </div>
  );
}
