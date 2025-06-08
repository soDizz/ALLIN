import { cn } from '@/lib/utils';
import { useState } from 'react';

type SlackProps = {
  size?: number;
  className?: string;
};

export const Slack = ({ size = 24, className }: SlackProps) => {
  return (
    <svg
      enableBackground='new 0 0 2447.6 2452.5'
      viewBox='0 0 2447.6 2452.5'
      xmlns='http://www.w3.org/2000/svg'
      width={size}
      height={size}
      className={cn(className)}
    >
      <g clipRule='evenodd' fillRule='evenodd'>
        <path
          d='m897.4 0c-135.3.1-244.8 109.9-244.7 245.2-.1 135.3 109.5 245.1 244.8 245.2h244.8v-245.1c.1-135.3-109.5-245.1-244.9-245.3.1 0 .1 0 0 0m0 654h-652.6c-135.3.1-244.9 109.9-244.8 245.2-.2 135.3 109.4 245.1 244.7 245.3h652.7c135.3-.1 244.9-109.9 244.8-245.2.1-135.4-109.5-245.2-244.8-245.3z'
          fill='#36c5f0'
        />
        <path
          d='m2447.6 899.2c.1-135.3-109.5-245.1-244.8-245.2-135.3.1-244.9 109.9-244.8 245.2v245.3h244.8c135.3-.1 244.9-109.9 244.8-245.3zm-652.7 0v-654c.1-135.2-109.4-245-244.7-245.2-135.3.1-244.9 109.9-244.8 245.2v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.3z'
          fill='#2eb67d'
        />
        <path
          d='m1550.1 2452.5c135.3-.1 244.9-109.9 244.8-245.2.1-135.3-109.5-245.1-244.8-245.2h-244.8v245.2c-.1 135.2 109.5 245 244.8 245.2zm0-654.1h652.7c135.3-.1 244.9-109.9 244.8-245.2.2-135.3-109.4-245.1-244.7-245.3h-652.7c-135.3.1-244.9 109.9-244.8 245.2-.1 135.4 109.4 245.2 244.7 245.3z'
          fill='#ecb22e'
        />
        <path
          d='m0 1553.2c-.1 135.3 109.5 245.1 244.8 245.2 135.3-.1 244.9-109.9 244.8-245.2v-245.2h-244.8c-135.3.1-244.9 109.9-244.8 245.2zm652.7 0v654c-.2 135.3 109.4 245.1 244.7 245.3 135.3-.1 244.9-109.9 244.8-245.2v-653.9c.2-135.3-109.4-245.1-244.7-245.3-135.4 0-244.9 109.8-244.8 245.1 0 0 0 .1 0 0'
          fill='#e01e5a'
        />
      </g>
    </svg>
  );
};

type SlackToggleButtonProps = {
  size?: number;
  className?: string;
  initialState?: boolean;
  onToggle?: (isOn: boolean) => void;
};

export const SlackToggleButton = ({
  size = 16,
  className,
  initialState = false,
  onToggle,
}: SlackToggleButtonProps) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleClick = () => {
    const newState = !isOn;
    setIsOn(newState);
    onToggle?.(newState);
  };

  return (
    <button
      type='button'
      onClick={handleClick}
      className={cn(
        'rounded-full p-1.5 transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        isOn
          ? 'bg-green-100 ring-2 ring-green-500 hover:bg-green-200 focus-visible:ring-green-500'
          : 'bg-gray-100 hover:bg-gray-200 focus-visible:ring-gray-400',
        className,
      )}
      aria-pressed={isOn}
    >
      <Slack size={size} className={cn('transition-opacity duration-200', !isOn && 'opacity-40')} />
    </button>
  );
};
