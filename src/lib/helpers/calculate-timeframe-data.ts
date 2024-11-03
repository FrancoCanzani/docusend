import {
  startOfDay,
  startOfMonth,
  startOfYear,
  endOfDay,
  endOfMonth,
  endOfYear,
  isWithinInterval,
} from 'date-fns';
import { TimeFrame } from '@/lib/types';
import { DocumentView } from '@/app/(dashboard)/documents/document/[documentId]/columns';

export function calculateTimeFrameData(
  documentViews: DocumentView[],
  timeFrame: TimeFrame
) {
  const now = new Date();

  switch (timeFrame) {
    case 'today': {
      const dayStart = startOfDay(now);
      const dayEnd = endOfDay(now);
      return documentViews.filter((view) => {
        const date = new Date(view.timestamp);
        return isWithinInterval(date, { start: dayStart, end: dayEnd });
      });
    }
    case 'this_month': {
      const monthStart = startOfMonth(now);
      const monthEnd = endOfMonth(now);
      return documentViews.filter((view) => {
        const date = new Date(view.timestamp);
        return isWithinInterval(date, { start: monthStart, end: monthEnd });
      });
    }
    case 'this_year': {
      const yearStart = startOfYear(now);
      const yearEnd = endOfYear(now);
      return documentViews.filter((view) => {
        const date = new Date(view.timestamp);
        return isWithinInterval(date, { start: yearStart, end: yearEnd });
      });
    }
    default:
      return documentViews;
  }
}
