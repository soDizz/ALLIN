import { ExternalLink } from 'lucide-react';

export const SlackGuide = () => {
  return (
    <div className='flex flex-col gap-3 px-4 pt-2'>
      <a
        href='https://github.com/gaki2/tutorial/blob/main/slack/README.md'
        target='_blank'
        rel='noreferrer'
        className='text-blue-500 underline text-sm px-1 flex gap-1 items-center'
      >
        Get Slack API Token in 1 minute
        <ExternalLink className='w-3 h-3 text-blue-500' />
      </a>
      <a
        href='https://slack.com/help/articles/221769328-Locate-your-Slack-URL-or-ID'
        target='_blank'
        rel='noreferrer'
        className='text-blue-500 underline text-sm px-1 flex gap-1 items-center'
      >
        Get Workspace ID in 1 minute
        <ExternalLink className='w-3 h-3 text-blue-500' />
      </a>
    </div>
  );
};
