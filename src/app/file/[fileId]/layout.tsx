'use client';

import dynamic from 'next/dynamic';
import { PHProvider } from '@/components/providers';

const PostHogPageView = dynamic(
  () => import('@/components/posthob-page-view'),
  {
    ssr: false,
  }
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PHProvider>
      <PostHogPageView />
      {children}
    </PHProvider>
  );
}
