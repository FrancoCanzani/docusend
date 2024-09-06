'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type UserMetadata = {
  full_name?: string;
  avatar_url?: string;
};

type User = {
  id: string;
  email?: string;
  user_metadata?: UserMetadata;
};

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadUser() {
      try {
        setLoading(true);
        setError(null);
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error loading user:', error);
        setError(
          error instanceof Error ? error.message : 'An unknown error occurred'
        );
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setError(null); // Clear any previous errors on auth state change
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return { user, loading, error };
}
