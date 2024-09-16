'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2 } from 'lucide-react';

export default function NDAForm({
  fileId,
  ndaText,
}: {
  fileId: string;
  ndaText: string;
}) {
  const [accepted, setAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accepted) {
      setIsLoading(true);
      try {
        document.cookie = `nda_accepted_${fileId}=true; path=/; Max-Age=600;`;
        router.refresh();
      } catch (error) {
        console.error('Error accepting NDA:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen p-4 bg-gray-100'>
      <Card className='w-full rounded-sm max-w-lg'>
        <CardHeader>
          <CardTitle>Non-Disclosure Agreement</CardTitle>
          <CardDescription>
            Please read and accept the NDA to proceed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <ScrollArea className='h-[200px] w-full rounded-md border p-4 mb-4'>
              <p className='text-sm prose'>{ndaText}</p>
            </ScrollArea>
            <div className='flex items-center space-x-2'>
              <Checkbox
                id='nda-accept'
                checked={accepted}
                onCheckedChange={(checked) => setAccepted(checked as boolean)}
                disabled={isLoading}
              />
              <label
                htmlFor='nda-accept'
                className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
              >
                I accept the NDA
              </label>
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button
            type='submit'
            className='w-full'
            disabled={!accepted || isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Processing...
              </>
            ) : (
              'Accept and Continue'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
