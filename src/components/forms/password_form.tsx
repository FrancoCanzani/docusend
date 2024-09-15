'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function PasswordForm({ fileId }: { fileId: string }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from('file_metadata')
        .select('password')
        .eq('file_id', fileId)
        .single();

      if (error) throw error;

      if (data.password === password) {
        document.cookie = `password_verified_${fileId}=true; path=/;`;
        router.refresh();
      } else {
        setError('Incorrect password');
      }
    } catch (error) {
      console.error('Error verifying password:', error);
      setError('An error occurred while verifying the password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen p-4 bg-gray-100'>
      <Card className='w-full rounded-sm max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl'>Password Protected File</CardTitle>
          <CardDescription>
            Enter the password to access this file
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='password' className='text-base'>
                File Password
              </Label>
              <div className='relative'>
                <Input
                  id='password'
                  type='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder='Enter password'
                />
              </div>
            </div>
            {error && (
              <Alert variant='destructive'>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type='submit'
            className='w-full'
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                Verifying...
              </>
            ) : (
              'Submit'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
