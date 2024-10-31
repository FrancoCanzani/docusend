'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, Clock, Globe } from 'lucide-react';
import { useMemo } from 'react';
import { DocumentView } from '@/app/(dashboard)/document/[documentId]/columns';
import { calculateDocumentStats } from '@/lib/helpers/calculate-document-stats';

interface DocumentStatsProps {
  documentViews: DocumentView[];
}

export function DocumentStats({ documentViews }: DocumentStatsProps) {
  const stats = useMemo(() => {
    return calculateDocumentStats(documentViews);
  }, [documentViews]);

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
    </div>
  );
}
