import { mergeRefs } from '@/lib/mergeRefs';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.focus();
      ref.current.selectionStart = ref.current.value.length;
    }
  }, []);

  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-background px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none max-h-24',
        className,
      )}
      {...props}
      ref={mergeRefs(ref, props.ref)}
    />
  );
}

export { Textarea };
