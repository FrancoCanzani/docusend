import { Invoice } from '@/app/(dashboard)/invoices/columns';
import { cn } from '@/lib/utils';
import { compareAsc, format, subMonths } from 'date-fns';

const getDaysInMonth = (date: Date) => {
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return new Date(year, month, 0).getDate();
};

export default function InvoiceCalendar({ data }: { data: Invoice[] }) {
  const today = new Date();
  const previousMonth = subMonths(today, 1);
  const month = new Date(
    previousMonth.getFullYear(),
    previousMonth.getMonth(),
    1
  );
  const days = Array.from({ length: getDaysInMonth(month) }, (_, i) => i + 1);

  return (
    <div className='space-y-4'>
      <h3>{format(month, 'MMMM yyyy')} invoices</h3>
      <div className='flex items-center justify-start flex-wrap gap-6'>
        {days.map((day) => {
          const date = new Date(month.getFullYear(), month.getMonth(), day);

          return (
            <div
              key={day}
              title={day.toString()}
              className={cn(
                'h-8 w-8 rounded bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer',
                compareAsc(date, today) > 0 && 'opacity-40'
              )}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
