import { loginWithEmail } from '@allin/api-client';
import { type FormEvent, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export const LoginEnterance = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFailed, setIsFailed] = useState(false);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    loginWithEmail({ email })
      .then(res => {
        console.log(res);
        setIsFailed(false);
      })
      .catch(err => {
        toast.error('로그인 실패', {
          position: 'top-center',
        });
        setIsFailed(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant='default' size='sm'>
          로그인
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>로그인하기</DialogTitle>
          <DialogDescription>
            지금은 이메일 로그인만 지원하고 있습니다. 계정 생성은 여기서..
          </DialogDescription>
        </DialogHeader>
        <form className='w-full flex flex-col gap-2' onSubmit={onSubmit}>
          <Label htmlFor='email'>이메일</Label>
          {isFailed && (
            <p className='text-xs text-red-500'>존재하지 않는 이메일</p>
          )}
          <Input id='email' name='email' disabled={isLoading} />
          <Button
            variant='default'
            size='sm'
            disabled={isLoading}
            type='submit'
          >
            로그인
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
