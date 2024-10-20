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
  const [tax, setTax] = useState(0);
  const [dates, setDates] = useState({
    issueDate: new Date(),
    dueDate: new Date(),
  });
  const [logo, setLogo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      tax,
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
        className='w-full bg-white sm:max-w-[100vw] md:w-[80vw] lg:w-[60vw] overflow-y-auto p-4 sm:p-6'
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreatePdf(e);
          }}
          className='bg-white text-black'
        >
          <Input
            type='text'
            className='text-3xl sm:text-5xl mb-4 sm:mb-8 font-bold w-full outline-none border-none p-0'
            value={invoiceID}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setInvoiceId(e.target.value)
            }
            name='number'
            autoFocus
            placeholder='Invoice #'
          />
          <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-8'>
            <div className='flex w-full flex-col space-y-2 text-sm mb-4 sm:mb-0'>
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
                  'rounded-sm transition-colors duration-200 flex items-center justify-center cursor-pointer',
                  !logo &&
                    'border border-dashed border-gray-300 hover:bg-muted/50'
                )}
                onClick={handleIconClick}
              >
                {logo ? (
                  <div className='flex flex-col space-y-1'>
                    <Image
                      src={logo}
                      alt='Invoice Icon'
                      width={120}
                      height={120}
                      className='rounded-sm'
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogo(null);
                      }}
                      className='text-xs hover:underline'
                    >
                      Delete
                    </button>
                  </div>
                ) : (
                  <div className='text-gray-600 font-bold w-20 h-20 flex justify-center items-center'>
                    <p>Logo</p>
                  </div>
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

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mb-4 sm:mb-8'>
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
                rows={6}
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
                rows={6}
                placeholder='Who is this invoice to?'
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
          <Button
            type='button'
            variant={'outline'}
            size={'sm'}
            onClick={addItem}
          >
            Add Item
          </Button>
          <div className='mt-8 flex flex-col sm:flex-row items-start sm:items-end justify-between sm:space-x-6'>
            <div className='w-full sm:w-1/2 mb-4 sm:mb-0'>
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
            <div className='w-full sm:w-1/2 text-sm'>
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
                  className='w-24 text-right p-0 border-none outline-none [&::-webkit-inner-spin-button]:appearance-none'
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
