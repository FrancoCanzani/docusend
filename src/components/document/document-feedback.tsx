'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { formatDate } from 'date-fns';

type FeedbackItem = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
};

type DocumentFeedbackProps = {
  feedback: FeedbackItem[];
};

export default function DocumentFeedback({ feedback }: DocumentFeedbackProps) {
  const [showAll, setShowAll] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const truncateMessage = (message: string, maxLength: number = 100) => {
    return message.length > maxLength
      ? `${message.slice(0, maxLength)}...`
      : message;
  };

  const toggleItemExpansion = (id: string) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const displayedFeedback = showAll ? feedback : feedback.slice(0, 5);

  return (
    <section className='w-full'>
      <div className='space-y-3 w-full'>
        {displayedFeedback.map((item) => (
          <div
            key={item.id}
            className='border border-black w-full rounded-sm p-2.5'
          >
            <div className='flex items-start space-x-4'>
              <div className='flex-grow space-y-2'>
                <div className='flex items-center justify-between'>
                  <div>
                    <span className='font-semibold text-gray-900'>
                      {item.name || 'Anonymous'}
                    </span>
                    <span className='text-sm text-gray-500 ml-2'>
                      ({item.email})
                    </span>
                  </div>
                  <time className='flex items-center justify-center text-xs text-gray-500'>
                    {formatDate(item.created_at, 'MM/dd/yyyy')}
                  </time>
                </div>
                <div className='text-sm text-gray-700'>
                  {expandedItems[item.id]
                    ? item.message
                    : truncateMessage(item.message)}
                  {item.message.length > 150 && (
                    <button
                      className='self-center font-medium text-xs mt-0.5 ml-1 text-gray-500 hover:text-gray-700'
                      onClick={() => toggleItemExpansion(item.id)}
                    >
                      {expandedItems[item.id] ? <>Show Less</> : <>Show More</>}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {feedback.length > 5 && !showAll && (
        <Button
          onClick={() => setShowAll(true)}
          className='mt-4 w-full'
          variant='outline'
        >
          See More
        </Button>
      )}
    </section>
  );
}
