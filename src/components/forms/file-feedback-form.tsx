'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type FormData = {
  name: string;
  email: string;
  message: string;
};

type FormErrors = {
  [K in keyof FormData]?: string;
};

interface FileFeedbackFormProps {
  fileId: string;
  user: User | null;
  className?: string;
}

export default function FileFeedbackForm({
  fileId,
  user,
  className,
}: FileFeedbackFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.user_metadata?.full_name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (formData.message.length < 5) {
      newErrors.message = 'Feedback message must be at least 5 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      const supabase = createClient();

      const submitFeedback = async () => {
        const { error } = await supabase.from('file_feedback').insert({
          file_id: fileId,
          name: formData.name,
          email: formData.email,
          message: formData.message,
        });

        if (error) throw error;

        return 'Feedback submitted successfully';
      };

      toast.promise(submitFeedback(), {
        loading: 'Submitting feedback...',
        success: (data) => {
          setFormData((prev) => ({ ...prev, message: '' }));
          setIsDialogOpen(false);
          return data;
        },
        error: (error) => {
          console.error('Error submitting feedback:', error);
          return 'Failed to submit feedback. Please try again.';
        },
        finally: () => {
          setIsSubmitting(false);
        },
      });
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size='icon'
          variant='outline'
          className={cn('h-8 w-8', className)}
        >
          <MessageCircle className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Provide Feedback</DialogTitle>
          <DialogDescription>
            We value your input. Please share your thoughts about this document.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <Label htmlFor='name'>Name</Label>
            <Input
              id='name'
              required
              name='name'
              value={formData.name}
              onChange={handleChange}
              placeholder='John Doe'
            />
            {errors.name && (
              <p className='text-sm text-red-500 mt-1'>{errors.name}</p>
            )}
          </div>
          {(!user || !user.email) && (
            <div>
              <Label htmlFor='email'>Email</Label>
              <Input
                id='email'
                name='email'
                type='email'
                required
                value={formData.email}
                onChange={handleChange}
                placeholder='john@example.com'
              />
              {errors.email && (
                <p className='text-sm text-red-500 mt-1'>{errors.email}</p>
              )}
            </div>
          )}
          <div>
            <Label htmlFor='message'>Your Feedback</Label>
            <Textarea
              id='message'
              name='message'
              required
              value={formData.message}
              onChange={handleChange}
              placeholder='Please share your thoughts...'
              className='resize-none'
            />
            {errors.message && (
              <p className='text-sm text-red-500 mt-1'>{errors.message}</p>
            )}
          </div>
          <DialogFooter>
            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
