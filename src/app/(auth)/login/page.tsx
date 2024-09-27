import { login, signup } from '@/lib/actions';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className='container h-screen flex items-center justify-center'>
      <form className='flex m-auto container space-y-4 flex-col p-8 max-w-lg border rounded-sm'>
        <Label htmlFor='email'>Email</Label>
        <Input id='email' name='email' type='email' required />
        <Label htmlFor='password'>Password</Label>
        <Input id='password' name='password' type='password' required />
        <div className='flex items-center justify-center space-x-3'>
          <Button className='flex-1' formAction={login}>
            Log in
          </Button>
          <Button className='flex-1' formAction={signup}>
            Sign up
          </Button>
        </div>
        <span className='w-full text-center'>- or -</span>
        <Button variant={'outline'}>Or continue with Magic Link</Button>
      </form>
    </div>
  );
}
