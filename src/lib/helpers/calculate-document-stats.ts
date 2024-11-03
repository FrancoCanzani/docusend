import { DocumentView } from '@/app/(dashboard)/documents/document/[documentId]/columns';

export type DeviceStats = {
  devices: Record<string, number>;
  browsers: Record<string, number>;
  locations: Record<string, number>;
  totalViews: number;
  uniqueVisitors: number;
  averageTime: number;
  countries: string[];
  regions: Record<string, number>;
};

export function calculateDocumentStats(views: DocumentView[]): DeviceStats {
  const totalViews = views.length;

  const uniqueVisitors = new Set(views.map((v) => v.ip).filter(Boolean)).size;

  const averageTime = Math.round(
    views.reduce((acc, v) => acc + v.duration, 0) / totalViews || 0
  );

  const devices = views.reduce((acc, view) => {
    const device = view.device_type || 'Unknown';
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const browsers = views.reduce((acc, view) => {
    const browser = view.browser || 'Unknown';
    acc[browser] = (acc[browser] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const locations = views.reduce((acc, view) => {
    const country = view.country || 'Unknown';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const regions = views.reduce((acc, view) => {
    const region = view.country_region || 'Unknown';
    acc[region] = (acc[region] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const countries = [
    ...new Set(views.map((v) => v.country).filter(Boolean)),
  ] as string[];

  return {
    devices,
    browsers,
    locations,
    totalViews,
    uniqueVisitors,
    averageTime,
    countries,
    regions,
  };
}
