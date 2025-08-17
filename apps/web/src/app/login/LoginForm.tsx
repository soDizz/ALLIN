'use client';

import { Loader2Icon } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const LoginForm = () => {
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
  };

  return (
    <form className='w-full flex flex-col gap-4 p-6' onSubmit={onSubmit}>
      <div className='grid w-full max-w-sm items-center gap-3'>
        <Label htmlFor='id'>이메일</Label>
        <Input disabled={isLoading} id='email' name='email' />
      </div>
      {/* <div className='grid w-full max-w-sm items-center gap-3'>
        <Label htmlFor='password'>비밀번호</Label>
        <Input
          type='password'
          disabled={isLoading}
          id='password'
          name='password'
        />
      </div> */}
      <Button className='cursor-pointer' disabled={isLoading} type='submit'>
        <>
          {isLoading && <Loader2Icon className='animate-spin' />}
          {isLoading ? '로그인 중...' : '로그인'}
        </>
      </Button>
    </form>
  );
};
