'use client';

import Link from 'next/link';
import User from './user';

export function Sidebar() {
  return (
    <div className='w-64 bg-white border-r h-screen hidden sm:block'>
      <div className='flex items-center justify-between h-16 px-6 border-b'>
        <Link href='/' className='flex items-center'>
          <span className='text-2xl font-bold'>DocuSend</span>
        </Link>
      </div>
      <nav className='font-medium'>
        <Link
          href='/documents'
          className='flex items-center px-6 py-4  hover:bg-gray-100'
        >
          Documents
        </Link>
        <Link
          href='/invoices'
          className='flex items-center px-6 py-3  hover:bg-gray-100'
        >
          Invoices
        </Link>
        <Link
          href='/team'
          className='flex items-center px-6 py-3  hover:bg-gray-100'
        >
          Team
        </Link>
        <Link
          href='/settings'
          className='flex items-center px-6 py-3  hover:bg-gray-100'
        >
          Settings
        </Link>
      </nav>
      <div className='absolute bottom-0 w-64'>
        {/* <StorageUsage documentMetadata={documentMetadata} /> */}
        <User />
      </div>
    </div>
  );
}
