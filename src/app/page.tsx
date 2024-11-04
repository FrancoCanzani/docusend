import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Link2,
  MessageSquare,
  RefreshCw,
  Users,
  Shield,
  BarChart2,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import Footer from '@/components/footer';

const features = [
  {
    title: 'Reject attachments, embrace links',
    description: 'Enhance security and control with dynamic links.',
    icon: <Link2 className='h-5 w-5' />,
  },
  {
    title: 'Real-time Engagement Insights',
    description: 'Gain valuable insights with interaction data.',
    icon: <MessageSquare className='h-5 w-5' />,
  },
  {
    title: 'Seamless Version Control',
    description: 'Edit shared documents on-the-fly.',
    icon: <RefreshCw className='h-5 w-5' />,
  },
  {
    title: 'Team collaboration',
    description:
      'Create teams, manage permissions, and collaborate seamlessly.',
    icon: <Users className='h-5 w-5' />,
  },
  {
    title: 'Document analytics',
    description: 'Track document views, time spent, and user engagement.',
    icon: <BarChart2 className='h-5 w-5' />,
  },
  {
    title: 'Secure sharing',
    description:
      'Set granular access controls, expiration dates, and password protection.',
    icon: <Shield className='h-5 w-5' />,
  },
];

export default function LandingPage() {
  return (
    <div className='min-h-screen w-full max-w-5xl mx-auto'>
      <div className='bg-gradient-to-tr from-neutral-50 to-gray-100 rounded-b-lg'>
        <header className='mx-auto py-6 px-8'>
          <nav className='flex items-end justify-between'>
            <div className='flex items-baseline justify-center space-x-3'>
              <h1 className='text-2xl font-bold'>DocuSend</h1>
              <h2 className='text-sm font-semibold uppercase'>
                Document sharing solutions
              </h2>
            </div>
            <div className='hidden md:flex space-x-4'>
              <a href='#' className='text-sm font-medium hover:underline'>
                About
              </a>
              <a href='#' className='text-sm font-medium hover:underline'>
                Support
              </a>
            </div>
          </nav>
        </header>
        <div className='w-full p-8 md:p-16'>
          <span className='border text-sm rounded-sm p-2 bg-white font-medium'>
            New | Invoice generation
          </span>
          <h1 className='mt-8 text-4xl mx-auto font-bold tracking-tight sm:text-5xl md:text-6xl'>
            Empower Your Team with Next-Gen{' '}
            <span className='text-blue-600'>Document</span> Sharing
          </h1>
          <p className='my-8 text-xl max-w-3xl font-medium text-start text-gray-600'>
            Streamline your document management and collaboration experience
            with our innovative sharing platform
          </p>
          <div className='flex items-center justify-start space-x-3'>
            <Button asChild className='font-bold'>
              <Link href={'/login'}>Get Started</Link>
            </Button>
            <Button asChild>
              <a href='#pricing'>See Pricing</a>
            </Button>
          </div>
        </div>
      </div>
      <section className='p-8 md:p-16 container' id='features'>
        <h2 className='text-3xl font-bold text-start mb-12'>
          Why do I need DocuSend?
        </h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {features.map((feature, index) => (
            <Card
              key={index}
              className='bg-transparent border hover:scale-105 transition-all duration-300'
            >
              <CardHeader className='pt-3 px-3 pb-0'>
                <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-pink-50/50 via-white to-gray-100 flex items-center justify-center mb-3'>
                  {feature.icon}
                </div>
                <CardTitle className='text-lg font-semibold'>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className='p-3'>
                <p className='text-gray-600 text-sm'>{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className='p-8 md:p-16' id='pricing'>
        <TooltipProvider>
          <div className='max-w-7xl mx-auto'>
            <div className='text-start'>
              <h2 className='text-3xl font-bold sm:text-4xl'>
                Simple Plans for Every Business
              </h2>
              <p className='mt-4 text-xl text-gray-600 font-medium'>
                Start free, upgrade as you grow. No hidden fees or storage
                limits.
              </p>
            </div>

            <div className='mt-16 space-y-12 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-x-8'>
              <div className='relative p-6 bg-transparent border hover:scale-105 transition-all duration-300 rounded-lg flex flex-col'>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold text-gray-900'>Free</h3>
                  <p className='mt-4 flex items-center justify-center text-gray-900'>
                    <span className='text-3xl font-bold tracking-tight'>
                      $0
                    </span>
                    <span className='ml-1 text-xl font-semibold'>/month</span>
                  </p>
                  <p className='mt-4 text-gray-500'>
                    Perfect for freelancers just getting started
                  </p>

                  <ul className='mt-4 space-y-3'>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Single user</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>
                        Up to 10 documents in storage
                      </span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Up to 10 invoices/month</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>5 days analytics storage</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Basic document sharing</span>
                    </li>
                  </ul>
                </div>
                <a
                  href='#'
                  className='bg-black text-white hover:bg-primary/90 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium'
                >
                  Get started
                </a>
              </div>

              <div className='relative p-6 bg-transparent border hover:scale-105 transition-all duration-300 rounded-lg flex flex-col'>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    Professional
                  </h3>
                  <p className='mt-4 flex items-center justify-center text-gray-900'>
                    <span className='text-3xl font-bold tracking-tight'>
                      $19
                    </span>
                    <span className='ml-1 text-xl font-semibold'>/month</span>
                  </p>
                  <p className='mt-4 text-gray-500'>
                    For growing businesses needing more features
                  </p>

                  <ul className='mt-4 space-y-3'>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Up to 3 team members</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Unlimited documents</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Up to 50 invoices/month</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>15 days analytics storage</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Document expiration</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Email verification</span>
                    </li>
                  </ul>
                </div>
                <a
                  href='#'
                  className='bg-black text-white hover:bg-primary/90 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium'
                >
                  Upgrade to Professional
                </a>
              </div>

              <div className='relative p-6 bg-transparent border hover:scale-105 transition-all duration-300 rounded-lg flex flex-col'>
                <div className='flex-1'>
                  <h3 className='text-xl font-semibold text-gray-900'>
                    Business
                  </h3>
                  <p className='mt-4 flex items-center justify-center text-gray-900'>
                    <span className='text-3xl font-bold tracking-tight'>
                      $49
                    </span>
                    <span className='ml-1 text-xl font-semibold'>/month</span>
                  </p>
                  <p className='mt-4 text-gray-500'>
                    For teams that need advanced features and control
                  </p>

                  <ul className='mt-4 space-y-3'>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='mx-3'>Up to 10 team members</span>
                      <Tooltip>
                        <TooltipTrigger>
                          <Users size={16} />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>$8/month per extra user</p>
                        </TooltipContent>
                      </Tooltip>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Unlimited documents</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Unlimited invoices</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Custom branded templates</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>
                        unlimited analytics & reporting
                      </span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>
                        Document expiration & revocation
                      </span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Email & NDA verification</span>
                    </li>
                    <li className='flex'>
                      <span className='text-green-500'>✓</span>
                      <span className='ml-3'>Priority support</span>
                    </li>
                  </ul>
                </div>
                <a
                  href='#'
                  className='bg-black text-white hover:bg-primary/90 mt-8 block w-full py-3 px-6 border border-transparent rounded-md text-center font-medium'
                >
                  Upgrade to Business
                </a>
              </div>
            </div>
          </div>
        </TooltipProvider>
      </section>
      <Footer />
    </div>
  );
}
