'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import Image from 'next/image';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { InvoiceCurrency } from './invoice-currency';
import { DatePicker } from '../ui/date-picker';
import { Trash2 } from 'lucide-react';

export default function CreateInvoiceSheet() {
  const [logo, setLogo] = useState<string | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState({
    name: 'INV-01',
    issueDate: new Date(),
    dueDate: new Date(new Date().setDate(new Date().getDate() + 14)),
    currency: 'USD',
  });
  const [sender, setSender] = useState({
    name: 'Lost Island AB',
    email: 'pontus@lostisland.co',
    phone: '36182-4441',
    address: 'Roslagsgatan 48',
    city: '211 34 Stockholm, Sweden',
    vatId: 'SE124676767602',
  });
  const [customer, setCustomer] = useState({
    name: 'Acme inc',
    email: 'john.doe@acme.com',
    phone: '36182-4441',
    address: 'Street 56',
    city: '243 21 California, USA',
    vatId: 'SE124676767602',
  });
  const [items, setItems] = useState([
    { description: 'Web design', price: 100, quantity: 185, vat: 0 },
  ]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSenderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSender((prev) => ({ ...prev, [name]: value }));
  };

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const addItem = () => {
    setItems([...items, { description: '', price: 0, quantity: 0, vat: 0 }]);
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const deleteItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCurrencyChange = (value: string) => {
    setInvoiceDetails((prev) => ({ ...prev, currency: value }));
  };

  const InvoiceContent = () => (
    <div className='bg-white text-black'>
      <div className='flex flex-col justify-between items-start mb-8 w-full'>
        <div className='flex items-start justify-between w-full'>
          {logo ? (
            <Image
              src={logo}
              alt='Company Logo'
              className='w-16 h-16 object-contain'
              width={50}
              height={50}
              onClick={() => setLogo(null)}
            />
          ) : (
            <input
              type='file'
              onChange={handleLogoChange}
              className='w-16 h-16'
            />
          )}
          <InvoiceCurrency
            onValueChange={handleCurrencyChange}
            value={invoiceDetails.currency}
          />
        </div>
        <div className='flex items-center justify-between w-full mt-4'>
          <div className='flex items-center justify-center'>
            Invoice:{' '}
            <input
              type='text'
              name='invoice'
              value={invoiceDetails.name}
              onChange={(e) =>
                setInvoiceDetails((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              className='w-full outline-none ml-1.5'
              placeholder='Invoice Number'
            />
          </div>
          <div>
            Issue Date:{' '}
            <DatePicker
              date={invoiceDetails.issueDate}
              setDate={(date) =>
                setInvoiceDetails((prev) => ({
                  ...prev,
                  issueDate: date || new Date(),
                }))
              }
            />
          </div>
          <div>
            Due Date:{' '}
            <DatePicker
              date={invoiceDetails.dueDate}
              setDate={(date) =>
                setInvoiceDetails((prev) => ({
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
          <h3 className='font-bold mb-2'>From</h3>
          <input
            type='text'
            name='name'
            value={sender.name}
            onChange={handleSenderChange}
            autoFocus
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='Company Name'
          />
          <input
            type='email'
            name='email'
            value={sender.email}
            onChange={handleSenderChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='Email'
          />
          <input
            type='tel'
            name='phone'
            value={sender.phone}
            onChange={handleSenderChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='Phone'
          />
          <input
            type='text'
            name='address'
            value={sender.address}
            onChange={handleSenderChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='Address'
          />
          <input
            type='text'
            name='city'
            value={sender.city}
            onChange={handleSenderChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='City'
          />
          <input
            type='text'
            name='vatId'
            value={sender.vatId}
            onChange={handleSenderChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='VAT ID'
          />
        </div>
        <div>
          <h3 className='font-bold mb-2'>Customer</h3>
          <input
            type='text'
            name='name'
            value={customer.name}
            onChange={handleCustomerChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='Customer Name'
          />
          <input
            type='email'
            name='email'
            value={customer.email}
            onChange={handleCustomerChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='Email'
          />
          <input
            type='tel'
            name='phone'
            value={customer.phone}
            onChange={handleCustomerChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='Phone'
          />
          <input
            type='text'
            name='address'
            value={customer.address}
            onChange={handleCustomerChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='Address'
          />
          <input
            type='text'
            name='city'
            value={customer.city}
            onChange={handleCustomerChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='City'
          />
          <input
            type='text'
            name='vatId'
            value={customer.vatId}
            onChange={handleCustomerChange}
            className='w-full mb-0.5 p-1 outline-none'
            placeholder='VAT ID'
          />
        </div>
      </div>

      <table className='w-full mb-8'>
        <thead>
          <tr className='border-b'>
            <th className='text-left py-2'>Description</th>
            <th className='text-right py-2'>Price</th>
            <th className='text-right py-2'>Quantity</th>
            <th className='text-right py-2'>VAT</th>
            <th className='text-right py-2'>Action</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index} className='border-b'>
              <td className='py-2'>
                <input
                  type='text'
                  value={item.description}
                  onChange={(e) =>
                    updateItem(index, 'description', e.target.value)
                  }
                  className='w-full p-1 border border-gray-300'
                />
              </td>
              <td className='py-2'>
                <input
                  type='number'
                  value={item.price}
                  onChange={(e) =>
                    updateItem(index, 'price', parseFloat(e.target.value))
                  }
                  className='w-full p-1 border border-gray-300 text-right'
                />
              </td>
              <td className='py-2'>
                <input
                  type='number'
                  value={item.quantity}
                  onChange={(e) =>
                    updateItem(index, 'quantity', parseInt(e.target.value))
                  }
                  className='w-full p-1 border border-gray-300 text-right'
                />
              </td>
              <td className='py-2'>
                <input
                  type='number'
                  value={item.vat}
                  onChange={(e) =>
                    updateItem(index, 'vat', parseFloat(e.target.value))
                  }
                  className='w-full p-1 border border-gray-300 text-right'
                />
              </td>
              <td className='py-2'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => deleteItem(index)}
                  className='h-8 w-8'
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button
        variant={'outline'}
        size={'sm'}
        onClick={addItem}
        className='mb-4 font-medium'
      >
        + Add item
      </Button>

      <div className='text-right mb-8'>
        <h3 className='text-xl font-semibold'>
          Total: {invoiceDetails.currency} {calculateTotal().toFixed(2)}
        </h3>
      </div>

      <div className='grid grid-cols-2 gap-8 mb-8'>
        <div>
          <Label htmlFor='paymentDetails' className='font-bold block mb-2'>
            Payment Details
          </Label>
          <Textarea
            id='paymentDetails'
            className='w-full p-2 border border-gray-300'
            rows={4}
          />
        </div>
        <div>
          <Label htmlFor='note' className='font-bold block mb-2'>
            Notes
          </Label>
          <Textarea
            id='note'
            className='w-full p-2 border border-gray-300'
            rows={4}
          />
        </div>
      </div>

      <div className='text-right'>
        <Button className='font-bold text-white'>Create & Send</Button>
      </div>
    </div>
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'outline'} size={'sm'}>
          Create Invoice
        </Button>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='w-[100vw] bg-white sm:max-w-[100vw] md:w-[80vw] lg:w-[60vw] overflow-y-auto'
      >
        <SheetHeader>
          <SheetTitle>Invoice</SheetTitle>
        </SheetHeader>
        <div className='mt-4'>
          <InvoiceContent />
        </div>
      </SheetContent>
    </Sheet>
  );
}
