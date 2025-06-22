import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { useChat } from '@ai-sdk/react';
import ky from 'ky';
import { Plus } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { v4 } from 'uuid';
import CryptoJS from 'crypto-js';

type UseChatReturn = ReturnType<typeof useChat>;

type ControllerProps = {
  messages: UseChatReturn['messages'];
  setMessages: UseChatReturn['setMessages'];
  handleSubmit: UseChatReturn['handleSubmit'];
  reload: UseChatReturn['reload'];
};

export function decryptData(cipherText: string, key: string) {
  const bytes = CryptoJS.AES.decrypt(cipherText, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}

export const Controller = ({ messages, setMessages, handleSubmit, reload }: ControllerProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const message = formData.get('message') as string;

    setMessages(prev => [
      ...prev,
      {
        role: 'user',
        id: v4(),
        content: message,
        parts: [{ type: 'text', text: message }],
      },
    ]);

    (textAreaRef.current as HTMLTextAreaElement).value = '';
  };

  return (
    <div className='flex flex-col w-[200px]'>
      <form onSubmit={onSubmit}>
        <Textarea ref={textAreaRef} name='message'></Textarea>
        <Button variant={'default'} size='icon' type='submit'>
          <Plus />
        </Button>
      </form>
      <Button
        onClick={() => {
          reload();
        }}
      >
        생성하기
      </Button>
    </div>
  );
};
