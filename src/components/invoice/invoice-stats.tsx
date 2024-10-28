'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Invoice } from '@/app/invoices/columns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Users, DollarSign, FileText, TrendingUp } from 'lucide-react';
import {
  format,
  subMonths,
  isWithinInterval,
  startOfMonth,
  startOfYear,
  startOfDay,
  endOfDay,
  endOfMonth,
  endOfYear,
} from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface InvoiceStatsProps {
  data: Invoice[];
}

type TimeFrame = 'today' | 'this_month' | 'this_year' | 'all_time';

export function InvoiceStats({ data }: InvoiceStatsProps) {
  const [timeFrame, setTimeFrame] = React.useState<TimeFrame>('this_month');

  const filteredData = React.useMemo(() => {
    const now = new Date();
    switch (timeFrame) {
      case 'today':
        const dayStart = startOfDay(now);
        const dayEnd = endOfDay(now);
        return data.filter((invoice) => {
          const date = new Date(invoice.created_at);
          return isWithinInterval(date, { start: dayStart, end: dayEnd });
        });
      case 'this_month':
        const startMonth = startOfMonth(now);
        const endMonth = endOfMonth(now);
        return data.filter((invoice) => {
          const date = new Date(invoice.created_at);
          return isWithinInterval(date, { start: startMonth, end: endMonth });
        });
      case 'this_year':
        const startYear = startOfYear(now);
        const endYear = endOfYear(now);
        return data.filter((invoice) => {
          const date = new Date(invoice.created_at);
          return isWithinInterval(date, { start: startYear, end: endYear });
        });
      default:
        return data;
    }
  }, [data, timeFrame]);

  const getTimeFrameLabel = (timeFrame: TimeFrame) => {
    switch (timeFrame) {
      case 'today':
        return "Today's";
      case 'this_month':
        return "This Month's";
      case 'this_year':
        return "This Year's";
      default:
        return 'All Time';
    }
  };

  const totalAmount = filteredData.reduce(
    (sum, invoice) => sum + invoice.total,
    0
  );
  const uniqueCustomers = new Set(
    filteredData.map((invoice) => invoice.customer_email)
  ).size;
  const averageInvoice = totalAmount / filteredData.length || 0;
  const pendingAmount = filteredData
    .filter((invoice) => !invoice.received)
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const monthlyData = React.useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      const monthStart = startOfMonth(date);
      const monthEnd = endOfMonth(date);
      const monthInvoices = data.filter((invoice) =>
        isWithinInterval(new Date(invoice.created_at), {
          start: monthStart,
          end: monthEnd,
        })
      );

      return {
        month: format(date, 'MMM yyyy'),
        total: monthInvoices.reduce((sum, invoice) => sum + invoice.total, 0),
        count: monthInvoices.length,
      };
    }).reverse();

    return last6Months;
  }, [data]);

  const customerStats = React.useMemo(() => {
    const stats = filteredData.reduce((acc, invoice) => {
      if (!acc[invoice.customer_email]) {
        acc[invoice.customer_email] = {
          email: invoice.customer_email,
          name: invoice.customer_name || invoice.customer_email,
          total: 0,
          count: 0,
        };
      }
      acc[invoice.customer_email].total += invoice.total;
      acc[invoice.customer_email].count += 1;
      return acc;
    }, {} as Record<string, { email: string; name: string; total: number; count: number }>);

    return Object.values(stats)
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);
  }, [filteredData]);

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold'>
          {getTimeFrameLabel(timeFrame)} Overview
        </h2>
        <Select
          value={timeFrame}
          onValueChange={(value: TimeFrame) => setTimeFrame(value)}
        >
          <SelectTrigger className='w-[180px]'>
            <SelectValue placeholder='Select time frame' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='today'>Today</SelectItem>
            <SelectItem value='this_month'>This Month</SelectItem>
            <SelectItem value='this_year'>This Year</SelectItem>
            <SelectItem value='all_time'>All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              {getTimeFrameLabel(timeFrame)} Revenue
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(totalAmount)}
            </div>
            <p className='text-xs text-muted-foreground'>
              {filteredData.length}{' '}
              {timeFrame === 'today' ? "today's" : 'total'} invoices
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Customers</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{uniqueCustomers}</div>
            <p className='text-xs text-muted-foreground'>Active clients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Average Invoice
            </CardTitle>
            <FileText className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(averageInvoice)}
            </div>
            <p className='text-xs text-muted-foreground'>Per invoice</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Pending Amount
            </CardTitle>
            <TrendingUp className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(pendingAmount)}
            </div>
            <p className='text-xs text-muted-foreground'>To be collected</p>
          </CardContent>
        </Card>
      </div>

      {timeFrame !== 'today' ? (
        <div className='grid gap-4 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-[200px]'>
                <ResponsiveContainer width='100%' height='100%'>
                  <BarChart
                    data={monthlyData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis
                      dataKey='month'
                      stroke='#888888'
                      fontSize={12}
                      axisLine={false}
                    />
                    <YAxis
                      stroke='#888888'
                      fontSize={12}
                      tickFormatter={(value) => `$${value.toLocaleString()}`}
                      axisLine={false}
                    />
                    <Tooltip
                      formatter={(value: number) =>
                        new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(value)
                      }
                    />
                    <Bar dataKey='total' fill='black' radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Top Customers</CardTitle>
            </CardHeader>
            <CardContent>
              {customerStats.length > 0 ? (
                <div className='space-y-4'>
                  {customerStats.map((customer) => (
                    <div key={customer.email} className='flex items-center'>
                      <div className='flex-1 space-y-1'>
                        <p className='text-sm font-medium leading-none'>
                          {customer.name}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {customer.email}
                        </p>
                        <p className='text-sm text-muted-foreground'>
                          {customer.count} invoice
                          {customer.count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <div className='text-sm font-medium'>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(customer.total)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className='text-sm text-muted-foreground text-center py-4'>
                  No data available for this time frame
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredData.length > 0 ? (
              <div className='space-y-4'>
                {filteredData.map((invoice) => (
                  <div
                    key={invoice.id}
                    className='flex items-center justify-between border-b pb-2'
                  >
                    <div className='space-y-1'>
                      <p className='text-sm font-medium'>
                        {invoice.customer_name}
                      </p>
                      <p className='text-sm text-muted-foreground'>
                        {invoice.customer_email}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {format(new Date(invoice.created_at), 'h:mm a')}
                      </p>
                    </div>
                    <div className='text-right'>
                      <p className='text-sm font-medium'>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD',
                        }).format(invoice.total)}
                      </p>
                      <Badge
                        variant={invoice.received ? 'default' : 'secondary'}
                      >
                        {invoice.received ? 'Received' : 'Pending'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className='text-sm text-muted-foreground text-center py-4'>
                No invoices created today
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
