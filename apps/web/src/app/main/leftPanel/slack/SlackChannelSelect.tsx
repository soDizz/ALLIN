'use client';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import { slack$$ } from '../../store/slackStore';
import type { GetSlackChannelsResponse } from '@mcp-server/slack';

type Status = {
  value: string;
  label: string;
};
const statuses: Status[] = [
  {
    value: 'backlog',
    label: 'Backlog',
  },
  {
    value: 'todo',
    label: 'Todo',
  },
  {
    value: 'in progress',
    label: 'In Progress',
  },
  {
    value: 'done',
    label: 'Done',
  },
  {
    value: 'canceled',
    label: 'Canceled',
  },
];

type Channel = {
  channelName: string;
  channelId: string;
};

const MAX_CHANNELS = 3;

export function SlackChannelSelect() {
  const [open, setOpen] = React.useState(false);
  const [selectedChannels, setSelectedChannels] = React.useState<Channel[]>([]);
  const { data, isLoading } = useQuery<GetSlackChannelsResponse['channels']>({
    queryKey: ['slack', 'channels'],
    queryFn: () => {
      return fetch(`/api/slack/channels?workspaceId=${slack$$.get().workspaceId}`, {
        headers: {
          Authorization: `Bearer ${slack$$.get().token}`,
          'Content-Type': 'application/json',
        },
      }).then(res => res.json());
    },
  });

  const onAddChannel = (channel: Channel) => {
    if (selectedChannels.length >= MAX_CHANNELS) {
      toast.warning(`You can only add up to ${MAX_CHANNELS} channels`, {
        position: 'top-center',
      });
      return;
    }
    setSelectedChannels(prev => [...prev, channel]);
  };

  const onRemoveChannel = (channel: Channel) => {
    setSelectedChannels(prev => prev.filter(c => c.channelId !== channel.channelId));
    toast.message(
      <p>
        Channel <span className='font-bold text-blue-400 italic'>{`${channel.channelName}`}</span>{' '}
        removed from list
      </p>,
      {
        duration: 3500,
        position: 'top-center',
        action: {
          label: 'Undo',
          onClick: () => {
            onAddChannel(channel);
          },
        },
      },
    );
  };

  return (
    <div className='flex items-start flex-col gap-4'>
      <p className='text-muted-foreground text-sm'>Channels</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant='outline' className='w-full justify-start h-fit'>
            {selectedChannels.length > 0 ? (
              <div className='flex flex-col items-start gap-1'>
                {selectedChannels.map(channel => (
                  <Badge
                    aria-label='Remove Channel'
                    className='cursor-pointer'
                    onClick={e => {
                      e.stopPropagation();
                      onRemoveChannel(channel);
                    }}
                    key={channel.channelId}
                  >
                    {channel.channelName}
                    <X className='size-6' />
                  </Badge>
                ))}
              </div>
            ) : (
              <>
                <Plus />
                <span>Add Channels</span>
              </>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='p-0' side='right' align='start'>
          <Command>
            <CommandInput placeholder='Search' />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {data?.map(channel => (
                  <CommandItem
                    key={channel.id}
                    value={channel.name}
                    onSelect={channelName => {
                      onAddChannel({
                        channelName,
                        channelId: channel.id,
                      });
                      setOpen(false);
                    }}
                  >
                    {channel.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
