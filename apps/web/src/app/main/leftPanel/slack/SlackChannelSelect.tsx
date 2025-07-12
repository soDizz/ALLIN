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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LoaderCircle, Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useQuery } from '@tanstack/react-query';
import type { GetSlackChannelsResponse } from '@mcp-server/slack';
import { useRxValue } from '@/lib/rxjs/useRx';
import { ToolManager } from '@/app/tools/ToolManager';
import { useMemo } from 'react';
import { SlackPointedChannel } from '@/app/tools/slack/SlackTool';

const MAX_CHANNELS = 3;

export function SlackChannelSelect() {
  const [open, setOpen] = React.useState(false);
  const slackTool = useMemo(
    () => ToolManager.getInstance().getTool('slack'),
    [],
  );
  const pointedChannels = useRxValue(
    slackTool.pointedChannels$,
    slackTool.pointedChannels,
  );
  const cert = useRxValue(slackTool.cert$, slackTool.cert);

  const {
    data: channels,
    isLoading,
    isError,
  } = useQuery<GetSlackChannelsResponse['channels']>({
    queryKey: ['slack', 'channels'],
    queryFn: () => {
      return fetch(`/api/slack/channels?workspaceId=${cert.WORKSPACE_ID}`, {
        headers: {
          Authorization: `Bearer ${cert.API_KEY}`,
          'Content-Type': 'application/json',
        },
      }).then(res => res.json());
    },
  });

  const onAddChannel = (channel: SlackPointedChannel) => {
    if (pointedChannels.length >= MAX_CHANNELS) {
      toast.warning(`You can only add up to ${MAX_CHANNELS} channels`, {
        position: 'top-center',
      });
      return;
    }
    slackTool.setPointedChannels(prev => [...prev, channel]);
  };

  const onRemoveChannel = (channel: SlackPointedChannel) => {
    slackTool.setPointedChannels(prev => prev.filter(c => c.id !== channel.id));
    toast.message(
      <p>
        Channel <span className='font-bold italic'>{`${channel.name}`}</span>{' '}
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
            {pointedChannels.length > 0 ? (
              <div className='flex flex-col items-start gap-1'>
                {pointedChannels.map(channel => (
                  <Badge
                    aria-label='Remove Channel'
                    className='cursor-pointer'
                    onClick={e => {
                      e.stopPropagation();
                      onRemoveChannel(channel);
                    }}
                    key={channel.id}
                  >
                    {channel.name}
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
            <CommandInput
              placeholder={isLoading || isError ? 'Loading...' : 'Search'}
            />
            <CommandList>
              <CommandEmpty>
                {isLoading ? (
                  <div className='w-full h-full flex items-center justify-center'>
                    <LoaderCircle className='animate-spin text-secondary-foreground' />
                  </div>
                ) : (
                  <>No results found.</>
                )}
              </CommandEmpty>
              <CommandGroup>
                {channels
                  ?.filter(
                    c => !pointedChannels.map(tempC => tempC.id).includes(c.id),
                  )
                  .map(channel => (
                    <CommandItem
                      key={channel.id}
                      value={channel.name}
                      onSelect={channelName => {
                        onAddChannel({
                          name: channelName,
                          id: channel.id,
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
