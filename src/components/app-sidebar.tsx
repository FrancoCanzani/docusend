'use client';

import Link from 'next/link';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './ui/dropdown-menu';
import { ChevronUp } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const items = [
  {
    title: 'Documents',
    url: 'documents',
  },
  {
    title: 'Invoices',
    url: 'invoices',
  },
  {
    title: 'DataRoom',
    url: '#',
  },
  {
    title: 'Teams',
    url: '#',
  },
  {
    title: 'Settings',
    url: '#',
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  console.log(pathname);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link
          href='/'
          className='flex items-center text-2xl font-bold h-16 px-2'
        >
          DocuSend
        </Link>
      </SidebarHeader>
      <SidebarContent className='px-4 text-xl space-y-4'>
        {items.map((item) => (
          <Link
            key={item.title}
            href={`/${item.url}`}
            className={cn(
              'font-medium hover:font-bold transition-all duration-150',
              pathname.includes(item.url) && 'font-bold'
            )}
          >
            {item.title}
          </Link>
        ))}
      </SidebarContent>
      <SidebarFooter className='h-16 px-4 font-medium'>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className='text-lg'>
                  Username
                  <ChevronUp className='ml-auto' />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side='top'
                className='w-[--radix-popper-anchor-width]'
              >
                <DropdownMenuItem>
                  <span>Account</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
