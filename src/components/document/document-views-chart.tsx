'use client';

import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import { format, parseISO, startOfDay } from 'date-fns';
import { DocumentView } from '@/app/document/[documentId]/columns';

type ChartData = {
  date: string;
  visitors: number;
  averageTimeSpent: number;
};

type DocumentViewsChartProps = {
  documentViews: DocumentView[];
};

const DocumentViewsChart: React.FC<DocumentViewsChartProps> = ({
  documentViews,
}) => {
  const chartData = useMemo(() => {
    const dataMap = new Map<
      string,
      { visitors: number; totalTimeSpent: number }
    >();

    documentViews.forEach((view) => {
      const date = startOfDay(parseISO(view.timestamp)).toISOString();
      const currentData = dataMap.get(date) || {
        visitors: 0,
        totalTimeSpent: 0,
      };

      dataMap.set(date, {
        visitors: currentData.visitors + 1,
        totalTimeSpent: currentData.totalTimeSpent + view.duration,
      });
    });

    return Array.from(dataMap, ([date, data]) => ({
      date,
      visitors: data.visitors,
      averageTimeSpent: data.totalTimeSpent / data.visitors,
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [documentViews]);

  const formatXAxis = (tickItem: string) => {
    return format(parseISO(tickItem), 'MMM dd');
  };

  return (
    <div className='space-y-8'>
      <div>
        <h3 className='text-lg font-semibold mb-2'>Visitors per Day</h3>
        <ResponsiveContainer width='100%' height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip
              labelFormatter={(label) =>
                format(parseISO(label), 'MMMM dd, yyyy')
              }
            />
            <Legend />
            <Bar dataKey='visitors' fill='#8884d8' name='Visitors' />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className='text-lg font-semibold mb-2'>
          Average Time Spent per Day (seconds)
        </h3>
        <ResponsiveContainer width='100%' height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis dataKey='date' tickFormatter={formatXAxis} />
            <YAxis />
            <Tooltip
              labelFormatter={(label) =>
                format(parseISO(label), 'MMMM dd, yyyy')
              }
            />
            <Legend />
            <Line
              type='monotone'
              dataKey='averageTimeSpent'
              stroke='#82ca9d'
              name='Avg Time (s)'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DocumentViewsChart;
