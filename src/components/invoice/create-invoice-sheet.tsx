'use client';

import React, { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '../ui/label';
import { DatePicker } from '../ui/date-picker';
import { InvoiceCurrency } from './invoice-currency';
import { Minus } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { InvoiceData } from '@/lib/types';
import { createInvoicePdf } from '@/lib/helpers/create-invoice-pdf';
import { toast } from 'sonner';

export default function CreateInvoiceSheet() {
  const [invoiceID, setInvoiceId] = useState('Invoice #001');
  const [senderEmail, setSenderEmail] = useState('');
  const [senderDetails, setSenderDetails] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerDetails, setCustomerDetails] = useState('');
  const [notes, setNotes] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [discount, setDiscount] = useState(0);
  const [dates, setDates] = useState({
    issueDate: new Date(),
    dueDate: new Date(),
  });
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [items, setItems] = useState([
    { description: '', quantity: 1, rate: 0, vat: 0, total: 0 },
  ]);

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setItems((prevItems) =>
      prevItems.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: value,
              total: item.quantity * item.rate * (1 + item.vat / 100),
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      { description: '', quantity: 1, rate: 0, vat: 0, total: 0 },
    ]);
  };

  const deleteItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const calculateSubtotal = () =>
    items.reduce((sum, item) => sum + item.total, 0);

  const calculateTotal = () => calculateSubtotal() * (1 - discount / 100);

  const handleCurrencyChange = (value: string) => setCurrency(value);

  const handleIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleIconChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target?.result) {
          setLogo(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePdf = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const invoiceData: InvoiceData = {
      invoiceID,
      logo,
      senderEmail,
      senderDetails,
      customerEmail,
      customerDetails,
      currency,
      dates: {
        issueDate: dates.issueDate.toISOString(),
        dueDate: dates.dueDate.toISOString(),
      },
      items,
      discount,
      notes,
      subtotal: calculateSubtotal(),
      total: calculateTotal(),
    };

    try {
      const pdfDataUri = await createInvoicePdf(invoiceData);

      // Create a link element and trigger download
      const link = document.createElement('a');
      link.href = pdfDataUri;
      link.download = `${invoiceID}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('PDF has been generated and downloaded');
    } catch (error) {
      toast.error('Error creating PDF');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant='outline' size='sm'>
          Create Invoice
        </Button>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='w-[100vw] bg-white sm:max-w-[100vw] md:w-[80vw] lg:w-[60vw] overflow-y-auto'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreatePdf(e);
          }}
          className='bg-white text-black p-6 pt-3'
        >
          <Input
            type='text'
            className='text-5xl mb-8 font-bold w-1/2 outline-none border-none p-0'
            value={invoiceID}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInvoiceId(e.target.value)
            }
            name='number'
            autoFocus
            placeholder='Invoice #'
          />
          <div className='flex items-center justify-between mb-8'>
            <div className='flex w-full flex-col space-y-0.5 text-sm'>
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
            <div>
              <div
                className={cn(
                  'w-20 h-20 rounded-sm hover:bg-muted/50 transition-colors duration-200 flex items-center justify-center cursor-pointer',
                  !logo && 'border border-dashed border-gray-300'
                )}
                onClick={handleIconClick}
              >
                {logo ? (
                  <Image
                    src={logo}
                    alt='Invoice Icon'
                    width={80}
                    height={80}
                    className='w-full h-full object-cover rounded-sm'
                  />
                ) : (
                  <span className='text-gray-600 font-bold'>Logo</span>
                )}
              </div>
              <input
                type='file'
                ref={fileInputRef}
                onChange={handleIconChange}
                accept='image/*'
                className='hidden'
              />
            </div>
          </div>

          <div className='grid grid-cols-2 gap-8 mb-8'>
            <div>
              <h3 className='font-bold mb-2'>Bill from</h3>
              <Input
                type='email'
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className='w-full mb-2'
                placeholder='Email'
              />
              <Textarea
                value={senderDetails}
                onChange={(e) => setSenderDetails(e.target.value)}
                className='w-full'
                rows={4}
                placeholder='Who is this invoice from?'
              />
            </div>
            <div>
              <h3 className='font-bold mb-2'>Bill to</h3>
              <Input
                type='email'
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className='w-full mb-2'
                placeholder='Email'
                required
              />
              <Textarea
                value={customerDetails}
                onChange={(e) => setCustomerDetails(e.target.value)}
                className='w-full'
                rows={4}
                placeholder='Who is this invoice to?'
              />
            </div>
          </div>

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
                  <td
                    className='py-2 w-3/5
                    '
                  >
                    <Input
                      type='text'
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, 'description', e.target.value)
                      }
                      required={index == 0}
                      placeholder='Description'
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
                          parseFloat(e.target.value)
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
                          parseFloat(e.target.value)
                        )
                      }
                      className='text-right [&::-webkit-inner-spin-button]:appearance-none'
                    />
                  </td>
                  <td className='py-2 text-right'>
                    <Button
                      variant='outline'
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
          <Button
            type='button'
            variant={'outline'}
            size={'sm'}
            onClick={addItem}
          >
            Add Item
          </Button>
          <div className='mt-8 flex items-end justify-between space-x-6'>
            <div className='w-1/2'>
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
            <div className='w-1/2 text-sm'>
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
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value))}
                  className='w-24 text-right p-0 border-none outline-none [&::-webkit-inner-spin-button]:appearance-none'
                />
              </div>
              <div className='flex justify-between font-bold text-base'>
                <span>Total</span>
                <span className='font-mono'>{calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className='flex justify-end mt-8 space-x-3'>
            <Button type='submit' className='font-bold text-white'>
              Create & Send
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
