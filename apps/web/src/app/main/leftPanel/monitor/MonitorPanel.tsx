import { Badge } from '@/components/ui/badge';
import { InfoTooltip } from '@/components/ui/InfoTooltip';
import { TypographyH3 } from '@/components/ui/typographyH3';
import { VestaBoard } from '@/components/ui/vesta-board/VestaBoard';
import { Info } from 'lucide-react';
import type { CSSProperties } from 'react';

export const MonitorPanel = () => {
  const tokenUsage = 2000;

  return (
    <div className='flex flex-col gap-4 px-4'>
      <li className='list-none flex flex-col gap-2'>
        <p className='text-lg font-semibold'>Message Token Usage</p>
        <InfoTooltip />
        <VestaBoard
          columnCount={5}
          style={
            {
              '--object-height': '32px',
              '--object-width': '24px',
              '--block-gap': '1px',
              '--crack-h': '0',
              '--crack-w': '0',
              // '--block-bg': 'transparent',
            } as CSSProperties
          }
          lines={[
            {
              text: tokenUsage.toString(),
              align: 'center',
              color: '#eee',
              charset: '0123456789 ',
            },
          ]}
          blockShape='default'
          theme='default'
        />
      </li>
    </div>
  );
};
