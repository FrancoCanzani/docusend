import { login, signup } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';

export default function LoginPage() {
  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <Card className='w-full max-w-md'>
        <CardHeader className='space-y-1'>
          <CardTitle className='text-2xl font-bold text-center'>
            Login or Sign Up
          </CardTitle>
          <CardDescription className='text-center'>
            Enter your email and password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email</Label>
              <Input id='email' name='email' type='email' required />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='password'>Password</Label>
              <Input id='password' name='password' type='password' required />
            </div>
            <div className='flex space-x-2'>
              <Button className='w-full' formAction={login}>
                Log in
              </Button>
              <Button className='w-full' variant='outline' formAction={signup}>
                Sign up
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
