import { Message, useChat } from '@ai-sdk/react';
import {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'sonner';
import { ToolManager } from '@/app/tools/ToolManager';
import { ScrollArea } from '@/components/ui/scroll-area';
import { getInitialPrompt } from './prompt';
import { Thread } from './Thread';
import { UserInput } from './UserInput';
import { generateMessage, messagesToThreads } from './chat-helper';
import { messageMinifier } from './message-minifier';
import { defer, filter, of } from 'rxjs';
import { MockMessage } from './mockMessage';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { VestaBoard } from '@/components/ui/vesta-board/VestaBoard';

const ASK_TOKEN_LIMIT = 4500;

export const Chat = () => {
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const initialMessages = useMemo(
    () => [generateMessage('system', getInitialPrompt())],
    [],
  );
  const messageMinifierRef = useRef(messageMinifier);
  const [cutoffMessages, setCutoffMessages] = useState<Message[]>([]);
  const [tokenUsage, setTokenUsage] = useState(500);

  const { messages, status, setMessages, reload, stop, error } = useChat({
    id: 'chat',
    api: '/api/chat',
    maxSteps: 5,
    onFinish: async (_m, o) => {
      const tokenUsage = o.usage.totalTokens;
      if (tokenUsage > ASK_TOKEN_LIMIT) {
        const minifiedMessages =
          await messageMinifierRef.current.minify(messages);
        setCutoffMessages(messageMinifierRef.current.cutOffMessages);
        // slice(-2) 를 하는 이유: onFinish 시점에 아직 messages 가 업데이트 되지 않아서
        // 마지막 2개의 메세지 (유저 질문, AI 대답) 을 가져오기 위해 추가함
        setMessages(prev => [...minifiedMessages, ...prev.slice(-2)]);
      }
      // @ts-expect-error - 디버깅 용도로 사용한다.
      window.__chat_messages = messages;
    },
    onError: e => {
      toast.error('Error occurred while processing your request.');
    },
    onResponse: res => {
      console.log('==> in res');
    },
    initialMessages,
    //https://ai-sdk.dev/cookbook/next/markdown-chatbot-with-memoization
    // Throttle the messages and data updates to 50ms
    experimental_throttle: 50,
  });

  // useEffect(() => {
  //   const messages = MockMessage.map(m => generateMessage(m.role, m.content));
  //   setMessages(prev => [...prev, ...messages]);
  // }, []);

  const sendMessage = useCallback(
    (newMessage: Message) => {
      defer(() =>
        messageMinifierRef.current.isMinifying
          ? messageMinifierRef.current.isMinifying$.pipe(
              filter(isMinifying => !isMinifying),
            )
          : of(true),
      ).subscribe(() => {
        setMessages(prev => [...prev, newMessage]);
        reload({
          body: {
            tools: ToolManager.getInstance().getServerPayload(),
          },
        });
      });
    },
    [reload, setMessages],
  );

  const threads = messagesToThreads([
    ...cutoffMessages,
    ...messages.filter(msg => msg.role !== 'system'),
  ]);

  return (
    <>
      {threads.length > 0 && (
        <ScrollArea
          ref={scrollViewRef}
          style={
            {
              '--data-streaming': status === 'streaming',
            } as React.CSSProperties
          }
          className='prose lg:px-6 max-w-none w-full max-h-[100%] h-0 min-h-0 grow mb-4 [&>div>div]:block! prose-p:my-4 prose-hr:my-4 prose-hr:invisible prose-headings:my-6 prose-li:my-1.5'
          scrollBarClassName='w-6 px-2 !-right-2'
        >
          <div className='p-4 gap-4 flex flex-col'>
            {threads.map((thread, index) => (
              <Thread
                key={`thread-${index}`}
                thread={thread}
                isLast={threads.length - 1 === index}
                status={status}
              ></Thread>
            ))}
          </div>
        </ScrollArea>
      )}
      {/* <button
        type='button'
        onClick={async () => {
          const res = await fetch('/api/chat/summary', {
            method: 'POST',
            body: JSON.stringify({ messages }),
          });
          const summary = await res.text();
          console.log(summary);
        }}
      >
        요약하기
      </button> */}
      {/* <div className='bg-linear-to-b from-[#000] to-[#2f2f2f] p-1 rounded-sm flex justify-center items-center'>
        <VestaBoard
          columnCount={5}
          style={
            {
              '--object-height': '20px',
              '--object-width': '14px',
              '--block-gap': '0px',
              '--crack-h': '0',
              '--crack-w': '0',
              '--block-bg': 'transparent',
            } as CSSProperties
          }
          lines={[
            {
              text: tokenUsage.toString(),
              align: 'center',
              color: '#eee',
              charset: '0123456789 ',
            },
          ]}
          blockShape='default'
          theme='default'
        />
      </div> */}
      <motion.div
        layout={'position'}
        className={cn('w-full flex flex-row gap-2 mt-[12px]')}
      >
        <UserInput status={status} stop={stop} sendMessage={sendMessage} />
      </motion.div>
    </>
  );
};
