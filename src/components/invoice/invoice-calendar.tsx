'use client';

import { Invoice } from '@/app/(dashboard)/invoices/columns';
import { cn } from '@/lib/utils';
import {
  compareAsc,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  getDay,
  isPast,
} from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryState } from 'nuqs';

const getDaysInMonth = (date: Date) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return new Date(year, month, 0).getDate();
};

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function InvoiceCalendar({ data }: { data: Invoice[] }) {
  const [monthOffset, setMonthOffset] = useQueryState('month', {
    defaultValue: '0',
    parse: (value) => value,
    serialize: (value) => value,
  });

  const today = new Date();
  const currentMonth = new Date(
    today.getFullYear(),
    today.getMonth() + parseInt(monthOffset),
    1
  );
  const month = startOfMonth(currentMonth);
  const daysInMonth = getDaysInMonth(month);
  const startDay = getDay(month);

  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNumber = i - startDay + 1;
    return dayNumber > 0 && dayNumber <= daysInMonth ? dayNumber : null;
  });

  const handlePreviousMonth = () => {
    setMonthOffset((parseInt(monthOffset) - 1).toString());
  };

  const handleNextMonth = () => {
    setMonthOffset((parseInt(monthOffset) + 1).toString());
  };

  return (
    <Card className='w-full max-w-3xl mx-auto'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-2xl font-bold'>
          {format(month, 'MMMM yyyy')} Invoices
        </CardTitle>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='icon' onClick={handlePreviousMonth}>
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button variant='outline' onClick={() => setMonthOffset('0')}>
            Today
          </Button>
          <Button variant='outline' size='icon' onClick={handleNextMonth}>
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </CardHeader>
      <CardContent className='p-4'>
        <TooltipProvider>
          <div className='grid grid-cols-7 gap-1'>
            {dayNames.map((name) => (
              <div
                key={name}
                className='text-center font-semibold text-sm py-2'
              >
                {name}
              </div>
            ))}
            {days.map((day, index) => {
              if (day === null) {
                return <div key={index} className='h-12' />;
              }

              const date = new Date(month.getFullYear(), month.getMonth(), day);
              const invoicesDueToday = data.filter((invoice) =>
                isSameDay(parseISO(invoice.due_date), date)
              );

              const overdueInvoices = invoicesDueToday.filter(
                (invoice) => !invoice.paid && isPast(parseISO(invoice.due_date))
              );
              const paidInvoices = invoicesDueToday.filter(
                (invoice) => invoice.paid
              );
              const pendingInvoices = invoicesDueToday.filter(
                (invoice) =>
                  !invoice.paid && !isPast(parseISO(invoice.due_date))
              );

              const totalAmount = invoicesDueToday.reduce(
                (sum, invoice) => sum + invoice.total,
                0
              );

              const getBackgroundColor = () => {
                if (overdueInvoices.length > 0)
                  return 'bg-red-100 hover:bg-red-200';
                if (pendingInvoices.length > 0)
                  return 'bg-yellow-100 hover:bg-yellow-200';
                if (paidInvoices.length > 0)
                  return 'bg-green-100 hover:bg-green-200';
                return 'bg-gray-50 hover:bg-gray-100';
              };

              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        'h-12 rounded-sm flex flex-col items-center justify-center cursor-pointer text-sm',
                        getBackgroundColor(),
                        compareAsc(date, today) < 0 && 'opacity-40'
                      )}
                    >
                      <span
                        className={cn(
                          invoicesDueToday.length > 0 && 'font-semibold'
                        )}
                      >
                        {day}
                      </span>
                      {invoicesDueToday.length > 0 && (
                        <span className='text-xs'>
                          ${totalAmount.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {invoicesDueToday.length > 0 ? (
                      <div className='space-y-1'>
                        <p className='font-semibold'>
                          {format(date, 'MMMM d, yyyy')}
                        </p>
                        {overdueInvoices.length > 0 && (
                          <p className='text-red-600'>
                            Overdue: {overdueInvoices.length}
                          </p>
                        )}
                        {pendingInvoices.length > 0 && (
                          <p className='text-yellow-600'>
                            Pending: {pendingInvoices.length}
                          </p>
                        )}
                        {paidInvoices.length > 0 && (
                          <p className='text-green-600'>
                            Paid: {paidInvoices.length}
                          </p>
                        )}
                        <p>Total: ${totalAmount.toFixed(2)}</p>
                      </div>
                    ) : (
                      <p>{format(date, 'MMMM d, yyyy')}</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
