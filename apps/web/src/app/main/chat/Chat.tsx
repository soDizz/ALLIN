import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageItem } from './Message';
import { useChat } from '@ai-sdk/react';
import { UserInput } from './UserInput';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { toolsStatus } from '../store/toolsStatusStore';

export const Chat = () => {
  const scrollViewRef = useRef<HTMLDivElement>(null);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit: handleSubmitChat,
    stop,
    status,
    setMessages,
  } = useChat({
    api: '/api/chat',
    body: {
      enabledTools: toolsStatus.getEnabledTools(),
    },
    maxSteps: 5,
    onFinish: () => {},
    onError: e => {
      console.log(e);
    },
  });

  useEffect(() => {
    const message1 =
      '답변은 최대한 구체적이고 길게 대답해야해. 답변하기 전에 내용이 정확한지 꼭 다시 한번 생각해줘. 할루시네이션을 절대 만들면 안돼';
    const message2 =
      '답변에서 중요한 부분에는 마크다운 문법을 사용해서 강조해줘. 하지만, 너무 남용하진 마.';
    const message3 = '유저는 한국인이니깐 특별한 지시사항이 없다면 한국을 기준으로 대답해줘.';
    const message4 = '최대한 친절한 어투로 대답해.';
    const message5 = '답변에 약간의 이모지를 추가해줘.';

    setMessages(prev => [
      ...prev,
      {
        role: 'system',
        id: crypto.randomUUID(),
        content: message1 + message2 + message3 + message4 + message5,

        parts: [
          {
            type: 'text',
            text: message1 + message2 + message3 + message4 + message5,
          },
        ],
      },
    ]);
  }, [setMessages]);

  useEffect(() => {
    if (status === 'error') {
      toast.error('Error occurred while processing your request.');
    }
  }, [status]);

  return (
    <>
      {messages.length > 0 && (
        <ScrollArea
          style={
            {
              '--data-streaming': status === 'streaming',
            } as React.CSSProperties
          }
          className='w-full max-h-[100%] h-0 min-h-0 grow mb-4 [&>div>div]:block!'
        >
          <div className='p-4 gap-4 flex flex-col'>
            {messages
              .filter(msg => msg.role !== 'system')
              .map(message => (
                <MessageItem key={message.id} message={message} />
              ))}
          </div>
        </ScrollArea>
      )}
      <UserInput
        input={input}
        handleInputChange={handleInputChange}
        stop={stop}
        handleSubmit={handleSubmitChat}
        status={status}
      />
    </>
  );
};
