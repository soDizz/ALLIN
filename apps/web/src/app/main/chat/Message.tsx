import type { Message } from '@ai-sdk/react';
import ReactMarkdown from 'react-markdown';
import { isInlineCode, ShikiHighlighter } from 'react-shiki';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';

type MessageItemProps = {
  message: Message;
};

const CodeHighlight: Components['code'] = ({ className, children, node, ...props }) => {
  const code = String(children).trim();
  const match = className?.match(/language-(\w+)/);
  const language = match ? match[1] : undefined;
  const isInline = node ? isInlineCode(node) : undefined;

  return !isInline ? (
    <ShikiHighlighter
      className='text-sm border border-gray-200 rounded-md [&>pre]:p-2!'
      addDefaultStyles={true}
      language={language}
      theme='github-light'
      {...props}
    >
      {code}
    </ShikiHighlighter>
  ) : (
    <code className={className} {...props}>
      {code}
    </code>
  );
};

export const MessageItem = ({ message }: MessageItemProps) => {
  const content = message.parts?.map((part, i) => {
    switch (part.type) {
      case 'text':
        return (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeHighlight,
              pre: ({ children }) => <div className='not-prose'>{children}</div>,
              a: ({ ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />,
            }}
            key={`${message.id}-${i}`}
          >
            {part.text}
          </ReactMarkdown>
        );
      case 'tool-invocation':
        return (
          <p
            className='text-xs text-muted-foreground'
            key={`${message.id}-${i}`}
          >{`calling ${part.toolInvocation.toolName}...`}</p>
        );
      default:
        return null;
    }
  });

  if (message.role === 'user') {
    return (
      <div key={message.id} className='flex flex-col gap-4 mt-4'>
        <h1 className='inline font-bold text-2xl'>{content}</h1>
      </div>
    );
  }

  return (
    <div className='prose' key={message.id}>
      {content}
    </div>
  );
};
