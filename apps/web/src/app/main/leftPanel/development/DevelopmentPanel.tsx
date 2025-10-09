import { getAuthHealth, getHealth } from '@allin/api-client';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from '@/components/ui/item';

export const DevelopmentPanel = () => {
  const onHealthCheck = () => {
    getHealth().then(response => {
      toast.success('Health Check 성공', {
        position: 'top-right',
      });
    });
  };

  const onHealthCheckAuth = () => {
    getAuthHealth().then(response => {
      toast.success('Health Check Auth 성공', {
        position: 'top-right',
      });
    });
  };
  return (
    <div className='flex flex-col gap-4 px-4'>
      <li className='list-none flex flex-col gap-2'>
        <Accordion type='multiple' className='w-full' defaultValue={['api']}>
          <AccordionItem value='api'>
            <AccordionTrigger>API 요청 테스트</AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 text-balance'>
              <Item variant='outline'>
                <ItemContent>
                  <ItemTitle>Health Check</ItemTitle>
                  <ItemDescription>/health GET 요청</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button onClick={onHealthCheck} variant='blue' size='sm'>
                    Action
                  </Button>
                </ItemActions>
              </Item>
              <Item variant='outline'>
                <ItemContent>
                  <ItemTitle>Health Auth Check</ItemTitle>
                  <ItemDescription>/health/auth GET 요청</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button onClick={onHealthCheckAuth} variant='blue' size='sm'>
                    Action
                  </Button>
                </ItemActions>
              </Item>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value='item-2'>
            <AccordionTrigger>placeholder</AccordionTrigger>
            <AccordionContent className='flex flex-col gap-4 text-balance'>
              <Item variant='outline'>
                <ItemContent>
                  <ItemTitle>Health Check</ItemTitle>
                  <ItemDescription>/health GET 요청</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button onClick={onHealthCheck} variant='blue' size='sm'>
                    Action
                  </Button>
                </ItemActions>
              </Item>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </li>
    </div>
  );
};
