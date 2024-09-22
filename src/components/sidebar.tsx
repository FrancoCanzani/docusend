'use client';

import Link from 'next/link';
import { LayoutDashboard, FileText, Users, Settings } from 'lucide-react';
import User from './user';
import { DocumentMetadata } from '@/lib/types';
import { StorageUsage } from './storage-usage';

export function Sidebar({
  documentMetadata,
}: {
  documentMetadata: DocumentMetadata[];
}) {
  return (
    <div className='w-64 bg-white shadow-lg h-screen hidden sm:block'>
      <div className='flex items-center justify-between h-16 px-6 border-b'>
        <Link href='/' className='flex items-center'>
          <span className='text-xl font-bold text-blue-600'>DocuSend</span>
        </Link>
      </div>
      <nav className='mt-6'>
        <Link
          href='/dashboard'
          className='flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100'
        >
          <LayoutDashboard className='h-5 w-5 mr-3' />
          Dashboard
        </Link>
        <Link
          href='/documents'
          className='flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100'
        >
          <FileText className='h-5 w-5 mr-3' />
          Documents
        </Link>
        <Link
          href='/team'
          className='flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100'
        >
          <Users className='h-5 w-5 mr-3' />
          Team
        </Link>
        <Link
          href='/settings'
          className='flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100'
        >
          <Settings className='h-5 w-5 mr-3' />
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
