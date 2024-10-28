'use client';

import React from 'react';
import { InvoiceData } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PageTop, PageBottom } from '@fileforge/react-print';
import { ScrollArea } from '@/components/ui/scroll-area';

interface InvoicePreviewProps {
  data: InvoiceData;
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

export default function InvoicePreviewDialog({ data }: InvoicePreviewProps) {
  const discountAmount = data.subtotal * (data.discount / 100);
  const taxAmount = (data.subtotal - discountAmount) * (data.tax / 100);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='outline' size='sm' className='font-bold'>
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[70%] sm:h-[90vh] p-0'>
        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>Invoice Preview</DialogTitle>
          <DialogDescription>
            Preview your invoice template before we send it to your client.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className='h-[calc(90vh-8rem)] p-6'>
          <div className='bg-white text-black font-mono'>
            <PageTop>
              <div className='flex justify-between items-center mb-14'>
                <h1 className='text-4xl font-bold'>Invoice</h1>
                <div className='text-right'>
                  <div className='font-bold text-lg'>{data.invoiceId}</div>
                  <div>Issue Date: {formatDate(data.dates.issueDate)}</div>
                  <div>Due Date: {formatDate(data.dates.dueDate)}</div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-8 mb-14'>
                <div>
                  <h2 className='font-bold text-gray-600 mb-3'>Invoice From</h2>
                  <div className='space-y-1'>
                    <div>{data.senderName}</div>
                    <div>{data.senderEmail}</div>
                    <div className='whitespace-pre-line'>
                      {data.senderDetails}
                    </div>
                  </div>
                </div>
                <div>
                  <h2 className='font-bold text-gray-600 mb-3'>Invoice To</h2>
                  <div className='space-y-1'>
                    <div>{data.customerName}</div>
                    <div>{data.customerEmail}</div>
                    <div className='whitespace-pre-line'>
                      {data.customerDetails}
                    </div>
                  </div>
                </div>
              </div>

              <table className='w-full mb-12'>
                <thead>
                  <tr className='border-b border-gray-300'>
                    <th className='text-left py-2'>Description</th>
                    <th className='text-right py-2 w-24'>Quantity</th>
                    <th className='text-right py-2 w-32'>Price</th>
                    <th className='text-right py-2 w-32'>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {data.items.map((item, index) => (
                    <tr key={index}>
                      <td className='py-2'>{item.description}</td>
                      <td className='text-right py-2'>{item.quantity}</td>
                      <td className='text-right py-2'>
                        {item.rate.toFixed(2)}
                      </td>
                      <td className='text-right py-2'>
                        {(item.quantity * item.rate).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className='flex justify-end mb-20'>
                <div className='w-64 space-y-1'>
                  <div className='flex justify-between'>
                    <span>Subtotal:</span>
                    <span>{data.subtotal.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Discount ({data.discount}%):</span>
                    <span>{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between'>
                    <span>Tax ({data.tax}%):</span>
                    <span>{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className='flex justify-between font-bold border-t border-gray-300 pt-2'>
                    <span>Total:</span>
                    <span>
                      {data.currency} {data.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-2 gap-8'>
                <div>
                  <h2 className='font-bold text-gray-600 mb-3'>
                    Payment Details
                  </h2>
                  <div className='whitespace-pre-line'>
                    {data.paymentDetails}
                  </div>
                </div>
                <div>
                  <h2 className='font-bold text-gray-600 mb-3'>Notes</h2>
                  <div className='whitespace-pre-line'>{data.notes}</div>
                </div>
              </div>
            </PageTop>

            <PageBottom>
              <div className='flex justify-start text-sm text-gray-600 mt-8 pt-2 border-t border-gray-300'>
                <span>Generated with DocuSend</span>
              </div>
            </PageBottom>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
