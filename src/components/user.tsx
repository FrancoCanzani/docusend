'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { createClient } from '@/lib/supabase/client';

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

  console.log(user);

  if (loading) {
    return <div>Loading...</div>; // Or a more sophisticated loading indicator
  }

  if (!user) {
    return <div>No user logged in</div>; // Or redirect to login page
  }

  return (
    <div className='p-4 border-t'>
      <div className='flex items-center mb-4'>
        <Avatar>
          <AvatarImage
            src={
              user.user_metadata?.avatar_url || 'https://github.com/shadcn.png'
            }
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
          <p className='text-xs text-gray-500'>{user.email}</p>
        </div>
      </div>
      <Button className='w-full mb-2' variant='outline'>
        Upgrade Account
      </Button>
      <Button className='w-full' variant='outline'>
        Create Team
      </Button>
    </div>
  );
}
