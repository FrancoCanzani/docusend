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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  format,
  parseISO,
  startOfDay,
  differenceInHours,
  addDays,
  isSameDay,
} from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentView } from '@/app/(dashboard)/document/[documentId]/columns';

type DocumentViewsChartProps = {
  documentViews: DocumentView[];
};

type TimeDistribution = {
  hour: number;
  views: number;
}[];

type RetentionData = {
  timeSpent: string;
  count: number;
}[];

type DeviceDistribution = {
  name: string;
  value: number;
}[];

export default function DocumentViewsChart({
  documentViews,
}: DocumentViewsChartProps) {
  const dailyData = useMemo(() => {
    const dataMap = new Map<
      string,
      {
        views: number;
        uniqueVisitors: Set<string>;
        totalTimeSpent: number;
      }
    >();

    documentViews.forEach((view) => {
      const date = startOfDay(parseISO(view.timestamp)).toISOString();
      const current = dataMap.get(date) || {
        views: 0,
        uniqueVisitors: new Set(),
        totalTimeSpent: 0,
      };

      dataMap.set(date, {
        views: current.views + 1,
        uniqueVisitors: current.uniqueVisitors.add(view.ip || view.id),
        totalTimeSpent: current.totalTimeSpent + view.duration,
      });
    });

    return Array.from(dataMap, ([date, data]) => ({
      date,
      views: data.views,
      uniqueVisitors: data.uniqueVisitors.size,
      averageTimeSpent:
        Math.round((data.totalTimeSpent / data.views) * 10) / 10,
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, [documentViews]);

  const timeDistribution = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      views: 0,
    }));

    documentViews.forEach((view) => {
      const hour = parseISO(view.timestamp).getHours();
      hours[hour].views++;
    });

    return hours;
  }, [documentViews]);

  const retentionData = useMemo(() => {
    const ranges = [
      { max: 10, label: '0-10s' },
      { max: 30, label: '11-30s' },
      { max: 60, label: '31-60s' },
      { max: 180, label: '1-3m' },
      { max: 300, label: '3-5m' },
      { max: Infinity, label: '5m+' },
    ];

    const distribution = ranges.map((range) => ({
      timeSpent: range.label,
      count: documentViews.filter((view) => {
        const prev = ranges[ranges.indexOf(range) - 1]?.max || 0;
        return view.duration > prev && view.duration <= range.max;
      }).length,
    }));

    return distribution;
  }, [documentViews]);

  const deviceDistribution = useMemo(() => {
    const devices = documentViews.reduce((acc, view) => {
      acc[view.device_type] = (acc[view.device_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(devices)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [documentViews]);

  return (
    <div className='space-y-6'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
        <Card>
          <CardHeader>
            <CardTitle>Daily Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={dailyData}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='date'
                    tickFormatter={(date) => format(parseISO(date), 'MMM dd')}
                    stroke='#888888'
                  />
                  <YAxis stroke='#888888' />
                  <Tooltip
                    labelFormatter={(label) =>
                      format(parseISO(label), 'MMMM dd, yyyy')
                    }
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                    }}
                  />
                  <Bar dataKey='views' fill='#000000' opacity={0.8} />
                  <Bar dataKey='uniqueVisitors' fill='#000000' opacity={0.4} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Distribution (24h)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <AreaChart data={timeDistribution}>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis
                    dataKey='hour'
                    tickFormatter={(hour) => `${hour}:00`}
                    stroke='#888888'
                  />
                  <YAxis stroke='#888888' />
                  <Tooltip
                    labelFormatter={(hour) => `${hour}:00`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                    }}
                  />
                  <Area
                    type='monotone'
                    dataKey='views'
                    stroke='#000000'
                    fill='#000000'
                    opacity={0.1}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Time Spent Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <BarChart data={retentionData} layout='vertical'>
                  <CartesianGrid strokeDasharray='3 3' />
                  <XAxis type='number' stroke='#888888' />
                  <YAxis
                    dataKey='timeSpent'
                    type='category'
                    stroke='#888888'
                    width={60}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                    }}
                  />
                  <Bar dataKey='count' fill='#000000' opacity={0.8} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Device Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='h-[300px]'>
              <ResponsiveContainer width='100%' height='100%'>
                <PieChart>
                  <Pie
                    data={deviceDistribution}
                    dataKey='value'
                    nameKey='name'
                    cx='50%'
                    cy='50%'
                    outerRadius={100}
                    innerRadius={60}
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {deviceDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill='#000000'
                        opacity={1 - index * 0.2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                    }}
                  />
                  <Legend verticalAlign='bottom' height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
