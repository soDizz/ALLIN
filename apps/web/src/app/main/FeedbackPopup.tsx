import { Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useRx } from '@/lib/rxjs/useRx';
import { feedbackInput$$, feedbackPopupOpen$$ } from './store/feedbackPopup$$';

export const FeedbackPopup = () => {
  const [open, setOpen] = useRx(feedbackPopupOpen$$);
  const [text, setText] = useRx(feedbackInput$$);

  const onSubmitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify({ feedback: text }),
    }).catch(e => {
      console.error(e);
    });
    setText('');
    setOpen(false);
    toast.success('Feedback sent successfully! 🤗', {
      duration: 2500,
    });
  };

  return (
    <>
      {open && (
        <div className='fixed bottom-[24px] right-[24px] rounded-lg border shadow-md flex flex-col gap-4 p-4 bg-background'>
          <div className='flex flex-row justify-between items-center'>
            <h3 className='text-lg leading-none font-medium'>
              Give us your feedback
            </h3>
            <Button
              variant={'ghost'}
              size={'icon'}
              onClick={() => setOpen(false)}
            >
              <X className='size-4' />
            </Button>
          </div>
          <p className='text-xs text-gray-500'>
            Thank you for your feedback! 🤗<br />
            We appreciate your input and will use it to improve our product.
          </p>
          <form className='flex flex-col gap-2' onSubmit={onSubmitFeedback}>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='feedback' className='text-sm text-gray-500'>
                Feedback
              </Label>
              <Textarea
                id='feedback'
                placeholder='Bug Report / Feature Request'
                className='min-h-24 max-h-32'
                value={text}
                onChange={e => setText(e.target.value)}
              />
            </div>
            <Button disabled={!text} type='submit' className='w-full'>
              <Send className='size-4' />
              Submit
            </Button>
          </form>
        </div>
      )}
    </>
  );
};
