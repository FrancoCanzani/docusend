'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Clock, User, Mail } from 'lucide-react';
import { format } from 'date-fns';

type ViewData = {
  file_id: string;
  user_id?: string;
  email?: string;
  time_spent: number;
  timestamp: string;
};

type FileViewsProps = {
  fileViews: ViewData[];
};

export default function FileViews({ fileViews }: FileViewsProps) {
  const [showAllViews, setShowAllViews] = useState(false);

  const totalViews = fileViews.length;
  const uniqueViewers = new Set(
    fileViews.map((view) => view.user_id || view.email)
  ).size;
  const totalTimeSpent = fileViews.reduce(
    (sum, view) => sum + view.time_spent,
    0
  );
  const averageTimeSpent = totalViews > 0 ? totalTimeSpent / totalViews : 0;

  const chartData = fileViews.map((view, index) => ({
    id: index + 1,
    timeSpent: view.time_spent,
  }));

  const displayedViews = showAllViews ? fileViews : fileViews.slice(0, 5);

  const formatTimestamp = (timestamp: string) => {
    return format(new Date(timestamp), 'MMM d, yyyy HH:mm:ss');
  };

  return (
    <div className='space-y-8'>
      <section>
        <h2 className='text-2xl font-bold mb-4'>View Statistics</h2>
        <div className='flex justify-between items-start flex-col md:flex-row gap-4 mb-6'>
          <div className='flex items-center space-x-2'>
            <User size={18} className='text-muted-foreground' />
            <span className='text-sm font-medium'>
              Total Views: {totalViews}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <Mail size={18} className='text-muted-foreground' />
            <span className='text-sm font-medium'>
              Unique Viewers: {uniqueViewers}
            </span>
          </div>
          <div className='flex items-center space-x-2'>
            <Clock size={18} className='text-muted-foreground' />
            <span className='text-sm font-medium'>
              Avg. Time: {averageTimeSpent.toFixed(1)}s
            </span>
          </div>
        </div>
        <div className='h-[300px] w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <BarChart data={chartData}>
              <XAxis dataKey='id' tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey='timeSpent' fill='black' />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section>
        <h2 className='text-2xl font-bold mb-4'>View Details</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Viewer</TableHead>
              <TableHead>Time Spent (s)</TableHead>
              <TableHead className='hidden md:block'>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedViews.map((view, index) => (
              <TableRow key={index}>
                <TableCell>
                  {view.email || view.user_id || 'Anonymous'}
                </TableCell>
                <TableCell>{view.time_spent}</TableCell>
                <TableCell className='hidden md:block'>
                  {formatTimestamp(view.timestamp)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {fileViews.length > 5 && (
          <Button
            onClick={() => setShowAllViews(!showAllViews)}
            className='mt-4'
            variant='outline'
          >
            {showAllViews ? 'Show Less' : 'Show All Views'}
          </Button>
        )}
      </section>
    </div>
  );
}
