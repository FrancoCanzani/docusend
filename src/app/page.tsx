import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <div className='flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-white'>
      <header className='px-4 lg:px-6 h-14 flex items-center'>
        <Link className='flex items-center justify-center' href='/'>
          <span className='sr-only'>DocuSend</span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-6 w-6 text-blue-600'
          >
            <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
          </svg>
          <span className='ml-2 text-xl font-bold text-blue-600'>DocuSend</span>
        </Link>
        <nav className='ml-auto flex gap-4 sm:gap-6'>
          <Link
            className='text-sm font-medium hover:text-blue-600 hover:underline underline-offset-4'
            href='#features'
          >
            Features
          </Link>
          <Link
            className='text-sm font-medium hover:text-blue-600 hover:underline underline-offset-4'
            href='#pricing'
          >
            Pricing
          </Link>
          <Link
            className='text-sm font-medium hover:text-blue-600 hover:underline underline-offset-4'
            href='#about'
          >
            About
          </Link>
        </nav>
      </header>
      <main className='flex-1'>
        <section className='w-full py-12 md:py-24 lg:py-32 xl:py-48'>
          <div className='container px-4 md:px-6'>
            <div className='flex flex-col items-center space-y-4 text-center'>
              <div className='space-y-2'>
                <h1 className='text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none'>
                  Welcome to <span className='text-blue-600'>DocuSend</span>
                </h1>
                <p className='mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400'>
                  Secure document sharing with powerful tracking features. Send,
                  collaborate, and monitor your important files with ease.
                </p>
              </div>
              <div className='space-x-4'>
                <Button asChild className='bg-blue-600 hover:bg-blue-700'>
                  <Link href='/login'>Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t'>
        <p className='text-xs text-gray-500 dark:text-gray-400'>
          © 2024 DocuSend. All rights reserved.
        </p>
        <nav className='sm:ml-auto flex gap-4 sm:gap-6'>
          <Link
            className='text-xs hover:text-blue-600 hover:underline underline-offset-4'
            href='#'
          >
            Terms of Service
          </Link>
          <Link
            className='text-xs hover:text-blue-600 hover:underline underline-offset-4'
            href='#'
          >
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
