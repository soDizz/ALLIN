import ReactMarkdown from 'react-markdown';
import { isInlineCode, ShikiHighlighter } from 'react-shiki';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { memo } from 'react';

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

export const MemoizedMarkdown = memo(({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code: CodeHighlight,
        pre: ({ children }) => <div className='not-prose'>{children}</div>,
        a: ({ ...props }) => <a {...props} target='_blank' rel='noopener noreferrer' />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

MemoizedMarkdown.displayName = 'MemoizedMarkdown';
