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
import { DocumentMetadata, Folder } from '@/lib/types';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { MoveToFolderDialog } from './move-to-folder-dialog';

interface DashboardTableProps {
  documentMetadata: DocumentMetadata[];
  folders: Folder[];
  activeFolderId: string | null;
}

export default function DashboardTable({
  documentMetadata,
  folders,
  activeFolderId,
}: DashboardTableProps) {
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
    meta: {
      folders,
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

  const activeFolder = folders.find((f) => f.id === activeFolderId);
  const tableName = activeFolder ? activeFolder.name : 'All Documents';

  const selectedDocuments = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);

  return (
    <div className='w-full text-black'>
      <h3 className='text-lg font-semibold mb-3'>{tableName}</h3>

      <div className='flex items-center pb-4 space-x-3'>
        <Input
          placeholder='Filter by name...'
          value={
            (table.getColumn('original_name')?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn('original_name')?.setFilterValue(event.target.value)
          }
          className='max-w-sm'
        />
        <Button
          variant='outline'
          size='sm'
          onClick={handleDeleteSelected}
          className={cn(
            'text-red-500 border-red-500 hover:text-red-600 hover:bg-red-50',
            table.getFilteredSelectedRowModel().rows.length === 0 && 'hidden'
          )}
        >
          Delete Selected
        </Button>
        {table.getFilteredSelectedRowModel().rows.length > 0 && (
          <MoveToFolderDialog
            documents={selectedDocuments}
            folders={folders}
            onMoveSuccess={() => window.location.reload()}
          />
        )}
      </div>
      <div className='rounded-sm border border-black'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className='bg-gray-50/50'>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className='h-10 border-b border-black text-black font-bold'
                    >
                      {header.isPlaceholder ? null : (
                        <div className='flex items-center'>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        </div>
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
                <TableCell colSpan={columns.length + 1} className='text-center'>
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
