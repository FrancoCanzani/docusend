'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { createClient } from '@/lib/supabase/client';
import { CreditCard, Users, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
      <div className='w-full max-w-md p-4 space-y-4'>
        <div className='flex items-center space-x-4'>
          <Skeleton className='h-12 w-12 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-4 w-[150px]' />
            <Skeleton className='h-4 w-[100px]' />
          </div>
        </div>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='w-full max-w-sm p-3 text-black'>
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
        <div className='ml-3'>
          <p className='text-sm font-medium'>
            {user.user_metadata?.full_name || 'User'}
          </p>
          <p className='text-xs text-muted-foreground'>{user.email}</p>
        </div>
      </div>
      <div className='flex flex-col space-y-2'>
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
      </div>
    </div>
  );
}
