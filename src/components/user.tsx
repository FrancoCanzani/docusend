'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { CreditCard, Users, LogOut, ChevronsLeftRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useUser } from '@/lib/hooks/use-user';

export default function User() {
  const { user, loading } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className='w-full max-w-md p-2 px-3 mb-2 space-y-4'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-10 w-10 rounded-sm' />
          <div className='space-y-2'>
            <Skeleton className='h-3 w-[150px]' />
            <Skeleton className='h-3 w-[100px]' />
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return;
  }

  return (
    <div className='w-full max-w-sm p-2 px-3 text-black'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className='space-y-2'>
          <Button
            className='w-full flex items-center justify-start pl-11'
            variant='outline'
          >
            <CreditCard className='mr-2 h-4 w-4' />
            Upgrade Account
          </Button>
          <Button
            className='w-full flex items-center justify-start pl-11'
            variant='outline'
          >
            <Users className='mr-2 h-4 w-4' />
            Create Team
          </Button>
          <Button
            className='w-full flex items-center justify-start pl-11'
            variant='outline'
            onClick={handleLogout}
          >
            <LogOut className='mr-2 h-4 w-4' />
            Log Out
          </Button>
        </CollapsibleContent>
        <div className='flex items-center mb-2 mt-3'>
          <Avatar>
            <AvatarImage
              src={user.user_metadata?.avatar_url}
              alt={user.user_metadata?.full_name || 'User'}
            />
            <AvatarFallback>
              {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className='ml-3 flex-grow'>
            <p className='text-sm font-medium'>
              {user.user_metadata?.full_name || 'User'}
            </p>
            <p className='text-xs text-muted-foreground max-w-36 truncate'>
              {user.email}
            </p>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant='ghost' size='sm' className='w-9 p-0'>
              <ChevronsLeftRight className='h-4 w-4 rotate-90' />
              <span className='sr-only'>Toggle user menu</span>
            </Button>
          </CollapsibleTrigger>
        </div>
      </Collapsible>
    </div>
  );
}
