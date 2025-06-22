'use client';

import { useRef, useState } from 'react';
import { Controller } from './Controller';
import { ChatLog } from './ChatLog';
import { v4 } from 'uuid';
import { useChat } from '@ai-sdk/react';

export default function Page() {
  const [id, setId] = useState(v4());
  const scrollViewRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, handleSubmit, status, reload } = useChat({
    id,
    api: '/api/chat',
    // body: {
    //   enabledTools: toolsStatus.getEnabledTools(),
    // },
    maxSteps: 5,
    onFinish: () => {
      scrollViewRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    onError: e => {
      console.log(e);
    },
  });

  return (
    <main className='w-screen h-screen flex gap-12'>
      <div className='p-4 max-w-[40vw] w-full h-full flex flex-col'>
        <ChatLog messages={messages} scrollRef={scrollViewRef} />
        <Controller
          messages={messages}
          reload={reload}
          setMessages={setMessages}
          handleSubmit={handleSubmit}
        />
      </div>
    </main>
  );
}
