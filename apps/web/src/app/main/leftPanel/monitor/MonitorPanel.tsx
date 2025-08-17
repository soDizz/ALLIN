import type { CSSProperties } from 'react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { VestaBoard } from '@/components/ui/vesta-board/VestaBoard';
import { useRxValue } from '@/lib/rxjs/useRx';
import { tokenUsage$$ } from '../../store/tokenUsage$$';

export const MonitorPanel = () => {
  const tokenUsage = useRxValue(tokenUsage$$);

  return (
    <div className='flex flex-col gap-4 px-4'>
      <li className='list-none flex flex-col gap-2'>
        <p className='text-lg font-semibold'>현재 메세지 토큰 사용량</p>
        <div className='flex flex-row gap-2 items-center ml-4 mt-1'>
          <VestaBoard
            columnCount={5}
            style={
              {
                '--object-height': '28px',
                '--object-width': '20px',
                '--block-gap': '1px',
                '--crack-h': '0',
                '--crack-w': '0',
                // '--block-bg': 'transparent',
              } as CSSProperties
            }
            lines={[
              {
                text: tokenUsage.toString(),
                align: 'right',
                color: '#eee',
                charset: '0123456789 ',
              },
            ]}
            blockShape='default'
            theme='default'
          />
        </div>
      </li>
    </div>
  );
};
