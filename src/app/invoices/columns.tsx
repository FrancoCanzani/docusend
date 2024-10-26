'use client';

import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Download } from 'lucide-react';

export type Invoice = {
  id: string;
  user_id: string;
  invoice_id: string;
  sender_name: string;
  sender_email: string;
  customer_name: string;
  customer_email: string;
  currency: string;
  issue_date: string;
  due_date: string;
  subtotal: number;
  total: number;
  received: boolean;
  created_at: string;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'invoice_id',
    header: 'Invoice',
    cell: ({ row }) => (
      <div className='font-medium'>{row.original.invoice_id}</div>
    ),
  },
  {
    accessorKey: 'customer_name',
    header: 'Customer',
    cell: ({ row }) => (
      <div className='flex flex-col'>
        <span className='font-medium text-sm'>
          {row.original.customer_name}
        </span>
        <span className='text-xs text-gray-500'>
          {row.original.customer_email}
        </span>
      </div>
    ),
  },
  {
    accessorKey: 'issue_date',
    header: 'Issue Date',
    cell: ({ row }) => format(new Date(row.original.issue_date), 'MMM d, yyyy'),
  },
  {
    accessorKey: 'due_date',
    header: 'Due Date',
    cell: ({ row }) => format(new Date(row.original.due_date), 'MMM d, yyyy'),
  },
  {
    accessorKey: 'total',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = parseFloat(row.original.total.toString());
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: row.original.currency,
      }).format(amount);

      return <div className='font-mono'>{formatted}</div>;
    },
  },
  {
    accessorKey: 'received',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.original.received ? 'default' : 'secondary'}>
        {row.original.received ? 'Received' : 'Pending'}
      </Badge>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const invoice = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost' className='h-8 w-8 p-0'>
              <span className='sr-only'>Open menu</span>
              <MoreHorizontal className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(invoice.id)}
            >
              Copy invoice ID
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className='mr-2 h-4 w-4' />
              Download PDF
            </DropdownMenuItem>
            {!invoice.received && (
              <DropdownMenuItem>Mark as Received</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
