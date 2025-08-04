import { useEffect, useId, useMemo } from 'react';
import { VestaBlock } from './VestaBlock';
import React from 'react';
import styles from './VestaLine.module.css';

type Align = 'left' | 'center' | 'right';

type VestaLineProps = {
  row: number;
  column: number;
  text: string;
  align: Align;
  color: string;
  charset: string;
  className?: string;
  style?: React.CSSProperties;
};

export const VestaLine = React.memo(
  ({
    row,
    column,
    text,
    align,
    color,
    charset,
    className,
    style,
  }: VestaLineProps) => {
    const id = useId();
    const alignedText = useMemo(
      () => alignText({ text, align, maxLength: column }),
      [text, align, column],
    );

    useEffect(() => {
      if ('registerProperty' in CSS) {
        CSS.registerProperty({
          name: `--line-color-${id}`,
          syntax: '<color>',
          inherits: true,
          initialValue: 'oklch(0.95 0 0)',
        });
      }
    }, [id]);

    useEffect(() => {
      document.documentElement.style.setProperty(`--line-color-${id}`, color);
    }, [color, id]);

    return (
      <div
        className={`${styles.vestaLine} ${className} custom-vestaLine-container`}
        style={{ display: 'flex', color: `var(--line-color-${id})`, ...style }}
      >
        {Array.from({ length: column }).map((_, currentColumn) => (
          <VestaBlock
            key={`${row}-${currentColumn}`}
            charset={charset}
            targetChar={alignedText[currentColumn]}
          />
        ))}
      </div>
    );
  },
);

VestaLine.displayName = 'VestaLine';

const alignText = ({
  text,
  align,
  maxLength,
}: {
  text: string;
  align: Align;
  maxLength: number;
}): string => {
  const textLength = text.length;
  const padding = maxLength - textLength;
  const paddingLeft = Math.floor(padding / 2);

  if (textLength >= maxLength) {
    return text.slice(0, maxLength);
  }

  switch (align) {
    case 'left':
      return text.padEnd(maxLength, ' ');
    case 'right':
      return text.padStart(maxLength, ' ');
    case 'center':
      return text.padStart(textLength + paddingLeft).padEnd(maxLength, ' ');
    default:
      return text;
  }
};
