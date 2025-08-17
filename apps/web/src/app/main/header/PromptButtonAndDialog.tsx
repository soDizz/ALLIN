import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Save, ScrollText } from 'lucide-react';
import { useRef, useState } from 'react';
import { userPrompt$$ } from '../store/userPromptStore';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'motion/react';

export const PromptButtonAndDialog = () => {
  const [value, setValue] = useState(userPrompt$$.get());
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const onSave = () => {
    userPrompt$$.set(value);
    toast.success('프롬프트가 성공적으로 저장되었습니다.', {
      position: 'top-center',
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant='ghost' size='icon' onClick={() => setOpen(true)}>
            <ScrollText />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className='text-xs text-gray-300'>Prompts</p>
        </TooltipContent>
      </Tooltip>
      {/* 자세히 보기 버튼을 눌렀을때 생기는 UI 로 인하여 마우스 커서의 위치가 버튼을 벗어나는 layout shift 를 막기 위해서, 
      Content 의 top 을 고정 시키는 코드 */}
      <DialogContent
        ref={contentRef}
        className='p-6 translate-y-0 top-[calc(50%-150px)]'
      >
        <DialogHeader>
          <DialogTitle>프롬프트를 입력해주세요.</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          <span className='text-gray-800'>
            AI는 프롬프트를 참고하여 답변합니다.
          </span>
          <Button
            size='xs'
            variant={'ghost'}
            className='ml-1'
            onClick={() => setIsDetailOpen(!isDetailOpen)}
          >
            {isDetailOpen ? '간단히 보기' : '자세히 보기'}
          </Button>
          <AnimatePresence>
            {isDetailOpen && (
              <motion.span
                className='inline-block'
                initial={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
                animate={{
                  opacity: 1,
                  y: 0,
                  filter: 'blur(0px)',
                  transition: { duration: 0.27, ease: 'easeOut' },
                }}
                exit={{
                  opacity: 0,
                  y: -3,
                  filter: 'blur(10px)',
                  transition: { duration: 0.24, ease: 'easeOut' },
                }}
              >
                <span className='text-xs '>
                  예시) 너는 영어 선생님이야. 내가 묻는 영어 질문에 다양한
                  예시를 들어서 답변을 해줘. 그리고 문법이 틀린 부분이 있다면
                  알려줘.
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </DialogDescription>
        <Textarea
          maxLength={500}
          className='min-h-[120px] max-h-[300px]'
          value={value}
          onChange={handleChange}
        ></Textarea>
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={onSave}>
              <Save />
              <span>저장하기</span>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
