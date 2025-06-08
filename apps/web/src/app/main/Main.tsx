'use client';

import { ChevronUp } from 'lucide-react';
import { ContextMenuShortcut } from '@/components/ui/context-menu';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useState } from 'react';
import { notify } from '@/lib/rxjs/notify';
import { SlackToggleButton } from '@/components/icon/slack';

export const Main = () => {
  const [question, setQuestion] = useState('');

  const handleSubmit = () => {
    setQuestion('');
    notify('on_question_submit');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // event.key가 'Enter'이고, Cmd(mac) 또는 Ctrl(windows) 키가 함께 눌렸는지 확인
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault(); // 기본 동작(줄바꿈) 방지
      handleSubmit();
    }
  };

  return (
    <main className='w-full flex flex-col gap-[12px] row-start-2 items-center'>
      <section className='w-full max-w-2xl flex flex-row gap-2 items-center'>
        <Textarea
          placeholder='Ask me'
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              disabled={!question}
              onClick={handleSubmit}
              className='cursor-pointer'
              variant={'outline'}
              size='icon'
            >
              <ChevronUp />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Submit</p>
            <ContextMenuShortcut>⌘ Enter</ContextMenuShortcut>
          </TooltipContent>
        </Tooltip>
      </section>
      <section className='w-full max-w-2xl flex flex-row gap-2 items-center'>
        <div aria-label='plugin group' className='flex flex-row gap-1 items-center'>
          <SlackToggleButton size={10} />
        </div>
      </section>
    </main>
  );
};
