import { VestaLine } from './VestaLine';
import styles from './VestaBoard.module.css';
import { memo } from 'react';
import { isEqual } from 'es-toolkit';

export const CHAR_SET = ' abcdefghijklmnopqrstuvwxyz!@0123456789 ';
export type Shape = 'default' | 'ellipse';
export type Theme = 'default' | 'sky' | 'peach' | 'magic';

export type VestaBoardProps = {
  columnCount: number;
  lines: Array<{
    text: string;
    align: 'left' | 'center' | 'right';
    color: string;
    charset: string;
  }>;
  blockShape: Shape;
  theme: Theme;
  className?: string;
  style?: React.CSSProperties;
};

export const VestaBoard = memo(
  ({
    columnCount,
    lines,
    blockShape,
    theme,
    className,
    style,
  }: VestaBoardProps) => {
    return (
      <>
        <svg
          style={{
            visibility: 'hidden',
            width: 0,
            height: 0,
            position: 'absolute',
          }}
        >
          <defs>
            <clipPath id='ellipse-top' clipPathUnits='objectBoundingBox'>
              <path d='M 0 0.49 A 0.5 0.49 0 1 1 1 0.49 Z' />
            </clipPath>
            <clipPath id='ellipse-bottom' clipPathUnits='objectBoundingBox'>
              <path d='M 0 0.51 A 0.5 0.49 0 1 0 1 0.51 Z' />
            </clipPath>
            {/* stdDeviation can control border radius */}
            <filter id='goo'>
              <feGaussianBlur
                in='SourceGraphic'
                stdDeviation='2'
                result='blur'
              />
              <feColorMatrix
                in='blur'
                mode='matrix'
                values='1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9'
                result='goo'
              />
              <feComposite in='SourceGraphic' in2='goo' operator='atop' />
            </filter>
          </defs>
        </svg>
        <div
          className={`${styles.boardContainer} ${className} custom-vestaBoard-container`}
          data-shape={blockShape}
          data-theme={theme}
          style={style}
        >
          {lines.map((line, index) => (
            <VestaLine
              key={`vesta-line-${index}`}
              row={index}
              column={columnCount}
              text={line.text.toLowerCase()}
              align={line.align}
              color={line.color}
              charset={line.charset}
            />
          ))}
        </div>
      </>
    );
  },
  (prevProps, nextProps) => {
    return (
      isEqual(prevProps.lines, nextProps.lines) &&
      prevProps.columnCount === nextProps.columnCount &&
      prevProps.blockShape === nextProps.blockShape &&
      prevProps.theme === nextProps.theme
    );
  },
);

VestaBoard.displayName = 'VestaBoard';
