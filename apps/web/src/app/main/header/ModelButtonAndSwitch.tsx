import { ArrowRightLeft, PlusSquare } from 'lucide-react';
import type { ComponentProps } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Divider } from '@/components/ui/divider';
import { Menu } from '@/components/ui/menu';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export const ModelButtonAndSwitch = () => {
  return (
    <Popover>
      <PopoverAnchor>
        <PopoverTrigger asChild>
          <Button
            variant={'ghost'}
            size='icon'
            className='cursor-pointer hover:bg-transparent'
          >
            <Avatar>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </Button>
        </PopoverTrigger>
      </PopoverAnchor>
      <PopoverContent className='p-3' align='end'>
        <Badge className='text-ring text-xs' variant={'ghost'}>
          Current Model
        </Badge>
        <Menu clickable={false}>
          <Menu.Head>
            <Avatar size='sm'>
              <AvatarImage src='https://github.com/shadcn.png' />
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </Menu.Head>
          <Menu.Content>
            <div>Model 1</div>
          </Menu.Content>
        </Menu>
        <Divider className='mb-1' />
        <Badge className='text-ring text-xs' variant={'ghost'}>
          <ArrowRightLeft />
          Switch Model
        </Badge>
        <ul>
          <Menu>
            <Menu.Head>
              <Avatar size='sm'>
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback></AvatarFallback>
              </Avatar>
            </Menu.Head>
            <Menu.Content>
              <div>Model 1</div>
            </Menu.Content>
          </Menu>
        </ul>
        <Divider className='mt-1' />
        <Button variant={'outline'} className='w-full'>
          <PlusSquare />
          Create New Model
        </Button>
      </PopoverContent>
    </Popover>
  );
};
