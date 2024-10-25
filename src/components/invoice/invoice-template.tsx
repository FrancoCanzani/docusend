import React from 'react';
import { PageTop, PageBottom } from '@fileforge/react-print';
import { InvoiceData } from '@/lib/types';

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString();
};

export const InvoiceTemplate = ({ data }: { data: InvoiceData }) => {
  const discountAmount = data.subtotal * (data.discount / 100);
  const taxAmount = (data.subtotal - discountAmount) * (data.tax / 100);

  return (
    <div className='bg-white text-black font-sans'>
      <PageTop>
        {/* Header Section */}
        <div className='flex justify-between items-center mb-8'>
          <h1 className='text-6xl font-bold'>Invoice</h1>
          <div className='text-right'>
            <div className='font-bold text-lg'>{data.invoiceId}</div>
            <div>Issue Date: {formatDate(data.dates.issueDate)}</div>
            <div>Due Date: {formatDate(data.dates.dueDate)}</div>
          </div>
        </div>

        {/* From and To Section */}
        <div className='grid grid-cols-2 gap-8 mb-8'>
          <div>
            <h2 className='font-bold text-gray-600 mb-3'>Invoice From</h2>
            <div className='space-y-1'>
              <div>{data.senderName}</div>
              <div>{data.senderEmail}</div>
              <div className='whitespace-pre-line'>{data.senderDetails}</div>
            </div>
          </div>
          <div>
            <h2 className='font-bold text-gray-600 mb-3'>Invoice To</h2>
            <div className='space-y-1'>
              <div>{data.customerName}</div>
              <div>{data.customerEmail}</div>
              <div className='whitespace-pre-line'>{data.customerDetails}</div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className='w-full mb-8'>
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
              <tr key={index} className='border-b border-gray-100'>
                <td className='py-2'>{item.description}</td>
                <td className='text-right py-2'>{item.quantity}</td>
                <td className='text-right py-2'>{item.rate.toFixed(2)}</td>
                <td className='text-right py-2'>
                  {(item.quantity * item.rate).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals Section */}
        <div className='flex justify-end mb-8'>
          <div className='w-64 space-y-2'>
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

        {/* Payment Details and Notes */}
        <div className='grid grid-cols-2 gap-8'>
          <div>
            <h2 className='font-bold text-gray-600 mb-3'>Payment Details</h2>
            <div className='whitespace-pre-line'>{data.paymentDetails}</div>
          </div>
          <div>
            <h2 className='font-bold text-gray-600 mb-3'>Notes</h2>
            <div className='whitespace-pre-line'>{data.notes}</div>
          </div>
        </div>
      </PageTop>

      <PageBottom>
        <div className='flex justify-between text-sm text-gray-400'>
          <span>Generated with DocuSend</span>
          <span>Page 1 of 1</span>
        </div>
      </PageBottom>
    </div>
  );
};
