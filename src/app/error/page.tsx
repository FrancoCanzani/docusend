'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function ErrorPage() {
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4'>
      <h1 className='text-2xl font-bold text-gray-800 mb-2'>
        Oops! Something went wrong
      </h1>
      <p className='text-gray-600 text-center mb-6'>
        We&apos;re sorry, but an error occurred. Please try again later.
      </p>
      <Link href='/'>
        <Button>Return to Home</Button>
      </Link>
    </div>
  );
}
