'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '../ui/textarea';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '../ui/label';
import { DatePicker } from '../ui/date-picker';
import { InvoiceCurrency } from './invoice-currency';
import { Minus } from 'lucide-react';

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
        <div className='mt-4'>
          <form className='bg-white text-black p-6 pt-3'>
            <div className='mb-8'>
              <Input
                type='text'
                className='text-5xl font-bold w-1/2 outline-none border-none p-0'
                value={invoiceID}
                onChange={(e) => setInvoiceId(e.target.value)}
                name='number'
                placeholder='Invoice #'
              />
            </div>

            <div className='flex items-end justify-start'>
              <div className='mb-8 flex w-full flex-col space-y-0.5 text-sm'>
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

            <table className='w-full mb-8'>
              <thead>
                <tr className='border-b'>
                  <th className='text-left py-2'>ITEM</th>
                  <th className='text-center py-2'>QTY</th>
                  <th className='text-right py-2'>RATE</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className='border-b'>
                    <td className='py-2'>
                      <Input
                        type='text'
                        value={item.description}
                        onChange={(e) =>
                          handleItemChange(index, 'description', e.target.value)
                        }
                        className='w-full p-1 border-none text-sm text-gray-500'
                        placeholder='Description'
                      />
                    </td>
                    <td className='py-2'>
                      <Input
                        type='number'
                        value={item.quantity}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            'quantity',
                            parseFloat(e.target.value)
                          )
                        }
                        className='w-full p-1 border-none text-center'
                      />
                    </td>
                    <td className='py-2'>
                      <Input
                        type='number'
                        value={item.rate}
                        onChange={(e) =>
                          handleItemChange(
                            index,
                            'rate',
                            parseFloat(e.target.value)
                          )
                        }
                        className='w-full p-1 border-none text-right'
                      />
                    </td>
                    <td className='py-2 text-right'>
                      <Button
                        variant='ghost'
                        size='icon'
                        onClick={() => deleteItem(index)}
                      >
                        <Minus />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <Button variant={'outline'} size={'sm'} onClick={addItem}>
              Add Item
            </Button>
            <div className='mt-8 flex items-end justify-between space-x-3'>
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
                    value={discount}
                    onChange={(e) => setDiscount(parseFloat(e.target.value))}
                    className='w-24 text-right p-0 border-none outline-none'
                  />
                </div>
                <div className='flex justify-between font-bold text-base'>
                  <span>Total</span>
                  <span className='font-mono'>
                    {calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className='flex justify-end mt-8'>
              <Button className='font-bold text-white'>Create & Send</Button>
            </div>
          </form>{' '}
        </div>
      </SheetContent>
    </Sheet>
  );
}
