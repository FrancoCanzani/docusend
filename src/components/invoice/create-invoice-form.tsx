'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '../ui/label';
import { DatePicker } from '../ui/date-picker';
import { InvoiceCurrency } from './invoice-currency';
import { Minus } from 'lucide-react';
import { InvoiceData } from '@/lib/types';
import { toast } from 'sonner';
import generateInvoicePDF from '@/lib/helpers/generate-invoice-pdf';
import { createInvoice } from '@/lib/actions';
import InvoicePreviewSheet from './invoice-preview-sheet';

export default function CreateInvoiceForm() {
  const [invoiceId, setInvoiceId] = useState('Invoice #001');
  const [senderName, setSenderName] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderDetails, setSenderDetails] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerDetails, setCustomerDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentDetails, setPaymentDetails] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [dates, setDates] = useState({
    issueDate: new Date(),
    dueDate: new Date(),
  });

  const [items, setItems] = useState([
    { description: '', quantity: 1, rate: 0 },
  ]);

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0 }]);
  };

  const deleteItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + item.quantity * item.rate, 0);

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const discountAmount = subtotal * (discount / 100);
    const taxAmount = (subtotal - discountAmount) * (tax / 100);
    return subtotal - discountAmount + taxAmount;
  };

  const handleCurrencyChange = (value: string) => setCurrency(value);

  const invoiceData: InvoiceData = {
    invoiceId,
    senderName,
    senderEmail,
    senderDetails,
    customerName,
    customerEmail,
    customerDetails,
    currency,
    dates: {
      issueDate: dates.issueDate.toISOString(),
      dueDate: dates.dueDate.toISOString(),
    },
    items,
    discount,
    tax,
    notes,
    paymentDetails,
    subtotal: calculateSubtotal(),
    total: calculateTotal(),
  };

  const handleCreatePdf = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const invoiceData: InvoiceData = {
        invoiceId,
        senderName,
        senderEmail,
        senderDetails,
        customerName,
        customerEmail,
        customerDetails,
        currency,
        dates: {
          issueDate: dates.issueDate.toISOString(),
          dueDate: dates.dueDate.toISOString(),
        },
        items,
        discount,
        tax,
        notes,
        paymentDetails,
        subtotal: calculateSubtotal(),
        total: calculateTotal(),
      };

      await createInvoice(invoiceData);
      // await generateInvoicePDF(invoiceData);

      toast.success('Invoice PDF generated successfully!');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate PDF. Please try again.');
    }
  };
  return (
    <section className='w-full bg-white overflow-y-auto'>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreatePdf(e);
        }}
        className='bg-white text-black'
      >
        <div className='flex items-center justify-between mb-6 lg:mb-8 '>
          <input
            type='text'
            className='text-3xl focus-visible:outline-none focus-visible:ring-0 focus-visible:border-none lg:text-5xl font-bold w-1/2 outline-none border-none p-0'
            value={invoiceId}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInvoiceId(e.target.value)
            }
            name='number'
            autoFocus
            placeholder='Invoice #'
          />
          <InvoicePreviewSheet data={invoiceData} />
        </div>

        <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between mb-6 lg:mb-8'>
          <div className='flex w-full flex-col space-y-2 text-sm mb-6 lg:mb-0'>
            <div className='flex items-center space-x-2 justify-start'>
              <span className='font-bold'>Currency:</span>
              <InvoiceCurrency
                onValueChange={handleCurrencyChange}
                value={currency}
              />
            </div>
            <div className='flex items-center space-x-2 justify-start'>
              <span className='font-bold'>Issue date:</span>
              <DatePicker
                date={dates.issueDate}
                className='mr-2'
                setDate={(date) =>
                  setDates((prev) => ({
                    ...prev,
                    issueDate: date || new Date(),
                  }))
                }
              />
            </div>
            <div className='flex items-center space-x-2 justify-start'>
              <span className='font-bold'>Due date:</span>
              <DatePicker
                date={dates.dueDate}
                setDate={(date) =>
                  setDates((prev) => ({
                    ...prev,
                    dueDate: date || new Date(),
                  }))
                }
              />
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 mb-6 lg:mb-8'>
          <div>
            <h3 className='font-bold mb-2'>Bill from</h3>
            <Input
              type='name'
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              className='w-full mb-2'
              placeholder='ACME Inc'
            />
            <Input
              type='email'
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className='w-full mb-2'
              placeholder='acme@company.com'
            />
            <Textarea
              value={senderDetails}
              onChange={(e) => setSenderDetails(e.target.value)}
              className='w-full'
              rows={6}
              placeholder='1355 Sansome St #4, 
                San Francisco, CA 94111,
                United States of America'
            />
          </div>
          <div>
            <h3 className='font-bold mb-2'>Bill to</h3>
            <Input
              type='customerName'
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className='w-full mb-2'
              placeholder='Apple Inc'
            />
            <Input
              type='email'
              value={customerEmail}
              onChange={(e) => setCustomerEmail(e.target.value)}
              className='w-full mb-2'
              placeholder='apple@icloud.com'
              required
            />
            <Textarea
              value={customerDetails}
              onChange={(e) => setCustomerDetails(e.target.value)}
              className='w-full'
              rows={6}
              placeholder='One Apple Park Way, 
                Cupertino, CA 95014,
                United States of America
                '
            />
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full mb-3'>
            <thead>
              <tr className='border-b'>
                <th className='text-left py-2 w-3/5'>ITEM</th>
                <th className='text-center py-2'>QTY</th>
                <th className='text-right py-2'>RATE</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className='border-b'>
                  <td className='py-2 w-3/5'>
                    <Input
                      type='text'
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, 'description', e.target.value)
                      }
                      required={index == 0}
                      placeholder='Human Resources Consultancy'
                    />
                  </td>
                  <td className='py-2'>
                    <Input
                      type='number'
                      value={item.quantity}
                      min={0}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          'quantity',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className='text-right [&::-webkit-inner-spin-button]:appearance-none'
                    />
                  </td>
                  <td className='py-2'>
                    <Input
                      type='number'
                      value={item.rate}
                      min={0}
                      onChange={(e) =>
                        handleItemChange(
                          index,
                          'rate',
                          parseFloat(e.target.value) || 0
                        )
                      }
                      className='text-right [&::-webkit-inner-spin-button]:appearance-none'
                    />
                  </td>
                  <td className='py-2 text-right'>
                    <Button
                      variant='outline'
                      type='button'
                      size='icon'
                      onClick={() => deleteItem(index)}
                    >
                      <Minus size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Button type='button' variant={'outline'} size={'sm'} onClick={addItem}>
          Add Item
        </Button>

        <div className='w-full mt-4'>
          <div className='flex justify-end'>
            <div className='w-full lg:w-1/2 text-sm space-y-1'>
              <div className='flex justify-between'>
                <span className='font-bold'>Subtotal</span>
                <span className='font-mono'>
                  {calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-bold'>Discount (%)</span>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  className='w-24 text-right h-5 p-0 border-none outline-none [&::-webkit-inner-spin-button]:appearance-none'
                />
              </div>
              <div className='flex justify-between items-center'>
                <span className='font-bold'>Tax (%)</span>
                <Input
                  type='number'
                  min={0}
                  max={100}
                  value={tax}
                  onChange={(e) => setTax(parseFloat(e.target.value) || 0)}
                  className='w-24 text-right h-5 p-0 border-none outline-none [&::-webkit-inner-spin-button]:appearance-none'
                />
              </div>
              <div className='flex justify-between font-bold text-base pt-2 border-t'>
                <span>Total</span>
                <span className='font-mono'>
                  {currency} {calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <div>
            <Label htmlFor='paymentDetails' className='font-bold block mb-2'>
              Payment Details
            </Label>
            <Textarea
              id='paymentDetails'
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
              placeholder='Bank of America,
                IBAN: GB54 BOFA 165050 12345678'
              className='w-full'
              rows={4}
            />
          </div>
          <div>
            <Label htmlFor='notes' className='font-bold block mb-2'>
              Notes
            </Label>
            <Textarea
              id='notes'
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder='Thanks for your business!'
              className='w-full'
              rows={4}
            />
          </div>
        </div>
        <div className='flex justify-end mt-8 space-x-3'>
          <Button type='submit' className='font-bold text-white'>
            Create & Send
          </Button>
        </div>
      </form>
    </section>
  );
}
