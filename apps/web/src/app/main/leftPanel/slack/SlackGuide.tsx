import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Accordion } from '@/components/ui/accordion';
import { ExternalLink } from 'lucide-react';

export const SlackGuide = () => {
  return (
    <Accordion type='multiple' className='w-full px-4'>
      <AccordionItem value='item-1'>
        <AccordionTrigger>Get Slack API Token in 1 minute</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>
          <a
            href='https://github.com/gaki2/tutorial/blob/main/slack/README.md'
            target='_blank'
            rel='noreferrer'
            className='text-blue-500 underline text-sm px-1 flex gap-1 items-center'
          >
            Go to Guide
            <ExternalLink className='w-3 h-3 text-blue-500' />
          </a>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value='item-2'>
        <AccordionTrigger>Get Workspace ID in 1 minute</AccordionTrigger>
        <AccordionContent className='flex flex-col gap-4 text-balance'>
          <a
            href='https://slack.com/help/articles/221769328-Locate-your-Slack-URL-or-ID'
            target='_blank'
            rel='noreferrer'
            className='text-blue-500 underline text-sm px-1 flex gap-1 items-center'
          >
            Go to Guide
            <ExternalLink className='w-3 h-3 text-blue-500' />
          </a>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};
