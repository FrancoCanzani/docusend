'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type FeedbackItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type FileFeedbackProps = {
  feedback: FeedbackItem[];
};

export default function FileFeedback({ feedback }: FileFeedbackProps) {
  const [showAll, setShowAll] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const truncateMessage = (message: string, maxLength: number = 50) => {
    return message.length > maxLength
      ? `${message.slice(0, maxLength)}...`
      : message;
  };

  const displayedFeedback = showAll ? feedback : feedback.slice(0, 5);

  return (
    <section className='w-full'>
      <h2 className='text-xl font-bold mb-4'>Feedback</h2>
      {feedback.length === 0 ? (
        <p className='text-center text-muted-foreground'>No feedback yet.</p>
      ) : (
        <div className='space-y-3'>
          {displayedFeedback.map((item) => (
            <div key={item.id} className='bg-white border rounded-lg p-2'>
              <div className='flex justify-between items-start'>
                <div className='flex-grow'>
                  <div className='font-semibold space-x-1'>
                    <span> {item.name || 'Anonymous'}</span>
                    <span className='text-xs'>({item.email})</span>
                  </div>
                  <p className='text-sm text-muted-foreground mt-1'>
                    {truncateMessage(item.message)}
                  </p>
                </div>
                <span className='text-sm'>{formatDate(item.created_at)}</span>
              </div>
            </div>
          ))}
          {feedback.length > 5 && !showAll && (
            <Button
              onClick={() => setShowAll(true)}
              className='mt-4 w-full'
              variant='outline'
            >
              See More
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
