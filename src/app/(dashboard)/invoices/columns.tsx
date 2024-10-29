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
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  paid: boolean;
  created_at: string;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-end justify-start'>
        <Checkbox
          className='p-0'
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-end justify-start'>
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'invoice_id',
    header: 'Invoice',
    cell: ({ row }) => (
      <div className='font-medium min-w-24'>{row.original.invoice_id}</div>
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
    header: () => <div className='hidden md:block'>Issue Date</div>,
    cell: ({ row }) => (
      <div className='hidden md:block'>
        {format(new Date(row.original.issue_date), 'MMM d, yyyy')}
      </div>
    ),
  },
  {
    accessorKey: 'due_date',
    header: () => <div className='hidden md:block'>Due Date</div>,
    cell: ({ row }) => (
      <div
        className={cn(
          'hidden md:block',
          !row.original.paid &&
            new Date(row.original.due_date) < new Date() &&
            'text-red-600'
        )}
      >
        {format(new Date(row.original.due_date), 'MMM d, yyyy')}
      </div>
    ),
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

      return <div className='font-medium'>{formatted}</div>;
    },
  },
  {
    accessorKey: 'received',
    header: () => <div className='hidden md:block'>Reception</div>,
    cell: ({ row }) => (
      <div className='hidden md:block'>
        <Badge variant={row.original.received ? 'default' : 'secondary'}>
          {row.original.received ? 'Received' : 'Pending'}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'payment',
    header: () => <div className='hidden md:block'>Payment</div>,
    cell: ({ row }) => (
      <div className='hidden md:block'>
        <Badge variant={row.original.paid ? 'default' : 'secondary'}>
          {row.original.received ? 'Paid' : 'Pending'}
        </Badge>
      </div>
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
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Download PDF</DropdownMenuItem>
            {!invoice.received && (
              <DropdownMenuItem>Mark as Received</DropdownMenuItem>
            )}
            <DropdownMenuItem>Mark as paid</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
