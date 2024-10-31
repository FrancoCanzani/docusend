'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, Clock, Globe, Monitor, BarChart } from 'lucide-react';
import { useMemo } from 'react';
import { TimeFrame } from '@/lib/types';
import { DocumentView } from '@/app/(dashboard)/document/[documentId]/columns';
import { calculateTimeFrameData } from '@/lib/helpers/calculate-timeframe-data';
import { calculateDocumentStats } from '@/lib/helpers/calculate-document-stats';
import { Progress } from '@/components/ui/progress';

interface DocumentStatsProps {
  documentViews: DocumentView[];
  timeFrame: TimeFrame;
}

export function DocumentStats({
  documentViews,
  timeFrame,
}: DocumentStatsProps) {
  const stats = useMemo(() => {
    const filteredData = calculateTimeFrameData(documentViews, timeFrame);
    return calculateDocumentStats(filteredData);
  }, [documentViews, timeFrame]);

  return (
    <div className='space-y-6'>
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Views</CardTitle>
            <Eye className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalViews}</div>
            <p className='text-xs text-muted-foreground'>Page views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Visitors</CardTitle>
            <Users className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.uniqueVisitors}</div>
            <p className='text-xs text-muted-foreground'>Unique IPs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Avg. Time</CardTitle>
            <Clock className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.averageTime}s</div>
            <p className='text-xs text-muted-foreground'>Per view</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Locations</CardTitle>
            <Globe className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.countries.length}</div>
            <p className='text-xs text-muted-foreground'>Countries</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Devices</CardTitle>
            <Monitor className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {Object.entries(stats.devices)
              .sort(([, a], [, b]) => b - a)
              .map(([device, count]) => (
                <div key={device} className='mb-2'>
                  <div className='flex justify-between text-sm mb-1'>
                    <span className='capitalize'>{device.toLowerCase()}</span>
                    <span>
                      {((count / stats.totalViews) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(count / stats.totalViews) * 100} />
                </div>
              ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Browsers</CardTitle>
            <BarChart className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            {Object.entries(stats.browsers)
              .sort(([, a], [, b]) => b - a)
              .map(([browser, count]) => (
                <div key={browser} className='mb-2'>
                  <div className='flex justify-between text-sm mb-1'>
                    <span className='capitalize'>{browser.toLowerCase()}</span>
                    <span>
                      {((count / stats.totalViews) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={(count / stats.totalViews) * 100} />
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
