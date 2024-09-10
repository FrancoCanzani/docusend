import React from 'react';
import { totalStorage } from '@/lib/helpers/total-storage';
import { FileMetadata } from '@/lib/types';
import { Progress } from '@/components/ui/progress';

interface StorageUsageProps {
  fileMetadata: FileMetadata[];
}

export function StorageUsage({ fileMetadata }: StorageUsageProps) {
  const usedStorage = totalStorage(fileMetadata);
  const maxStorage = 100;
  const usagePercentage = (usedStorage / maxStorage) * 100;

  return (
    <div className='space-y-2 w-full max-w-sm p-2 px-3'>
      <Progress value={usagePercentage} className='w-full h-2 rounded-sm' />
      <p className='text-sm text-gray-600'>
        {usedStorage.toFixed(2)} MB used out of {maxStorage} MB
      </p>
      <p className='text-xs text-gray-500'>
        {(maxStorage - usedStorage).toFixed(2)} MB available
      </p>
    </div>
  );
}