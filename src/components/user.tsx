'use client';

import { useState, useEffect } from 'react';
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

export default function User() {
  const [user, setUser] = useState<{
    id: string;
    email?: string;
    user_metadata?: {
      full_name?: string;
      avatar_url?: string;
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) throw error;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error loading user:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  if (loading) {
    return (
      <div className='w-full max-w-md p-2 mb-2 space-y-4'>
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
    return null;
  }

  return (
    <div className='w-full max-w-sm p-2 text-black'>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className='flex items-center mb-2'>
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
        <CollapsibleContent className='space-y-2'>
          <Button className='w-full' variant='outline'>
            <CreditCard className='mr-2 h-4 w-4' />
            Upgrade Account
          </Button>
          <Button className='w-full' variant='outline'>
            <Users className='mr-2 h-4 w-4' />
            Create Team
          </Button>
          <Button className='w-full' variant='outline' onClick={handleLogout}>
            <LogOut className='mr-2 h-4 w-4' />
            Log Out
          </Button>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
