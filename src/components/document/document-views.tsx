'use client';

import { DocumentStats } from './document-stats';
import DocumentViewsChart from './document-views-chart';
import DocumentViewsMap from './document-views-map';
import DocumentViewsTable from './document-views-table';
import { DocumentView } from '@/app/(dashboard)/documents/document/[documentId]/columns';
import { TimeFrame } from '@/lib/types';
import { useState, useMemo } from 'react';
import { calculateTimeFrameData } from '@/lib/helpers/calculate-timeframe-data';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type DocumentViewsProps = {
  documentViews: DocumentView[];
};

export default function DocumentViews({ documentViews }: DocumentViewsProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('all_time');

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

  const filteredData = useMemo(() => {
    return calculateTimeFrameData(documentViews, timeFrame);
  }, [documentViews, timeFrame]);

  const handleTimeFrameChange = (value: string) => {
    setTimeFrame(value as TimeFrame);
  };

  return (
    <div className='space-y-6'>
      <div className='flex justify-between items-center'>
        <h2 className='text-lg font-semibold'>
          {getTimeFrameLabel(timeFrame)} Overview
        </h2>
        <Select value={timeFrame} onValueChange={handleTimeFrameChange}>
          <SelectTrigger className='w-[180px]'>
            <SelectValue>{getTimeFrameLabel(timeFrame)}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='today'>Today</SelectItem>
            <SelectItem value='this_month'>This Month</SelectItem>
            <SelectItem value='this_year'>This Year</SelectItem>
            <SelectItem value='all_time'>All Time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DocumentStats documentViews={filteredData} />
      <DocumentViewsTable documentViews={filteredData} />
      <DocumentViewsChart documentViews={filteredData} />
      <DocumentViewsMap documentViews={filteredData} />
    </div>
  );
}
