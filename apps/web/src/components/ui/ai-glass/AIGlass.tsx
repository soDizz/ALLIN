import gsap from 'gsap';
import { type MotionProps, motion } from 'motion/react';
import { type CSSProperties, useEffect } from 'react';
import styles from './glass.module.css';

export type AIGlassConfig = {
  reduceMotion?: boolean;
  lightDirection?: 'left' | 'right';
  // globe 의 유리 두께
  border?: number;
  // 물결 회오리 방향
  // deprecated
  waveDirection?: 'clockwise' | 'counterclockwise';
  theme?: 'blue' | 'orange';
};

export type RequiredAIGlassConfig = Required<AIGlassConfig>;

export const defaultConfig = {
  reduceMotion: false,
  lightDirection: 'left',
  // globe 의 유리 두께
  border: 12,
  // 물결 회오리(먹물) 방향
  waveDirection: 'clockwise',
  theme: 'blue',
} satisfies AIGlassConfig;

const twoSetter = gsap.utils.pipe((config: RequiredAIGlassConfig) => {
  const circleX = config.lightDirection === 'left' ? 33 : 70;
  gsap.quickSetter(`.${styles.two}`, '--circle-x-2', '%')(circleX);
});

const threeSetter = gsap.utils.pipe((config: RequiredAIGlassConfig) => {
  const circleX = config.lightDirection === 'left' ? 31 : 72;
  const border = gsap.utils.clamp(0, 10, config.border);
  gsap.quickSetter(`.${styles.three}`, '--circle-x-3', '%')(circleX);
  gsap.quickSetter(`.${styles.three}`, '--border-w-3', 'px')(border);
});

const sevenSetter = gsap.utils.pipe((config: RequiredAIGlassConfig) => {
  const waveDirection =
    config.waveDirection === 'clockwise' ? 'normal' : 'reverse';
  gsap.quickSetter(`.${styles.seven}`, '--wave-direction')(waveDirection);
});

const nineSetter = gsap.utils.pipe((config: RequiredAIGlassConfig) => {
  gsap.set(`.${styles.nine}`, {
    attr: {
      'data-light-direction': config.lightDirection,
    },
  });
});

const tenSetter = gsap.utils.pipe((config: RequiredAIGlassConfig) => {
  gsap.set(`.${styles.ten}`, {
    attr: {
      'data-light-direction': config.lightDirection,
    },
  });
});

const elevenSetter = gsap.utils.pipe((config: RequiredAIGlassConfig) => {
  gsap.set(`.${styles.eleven}`, {
    attr: {
      'data-light-direction': config.lightDirection,
    },
  });
});

const thirteenSetter = gsap.utils.pipe((config: RequiredAIGlassConfig) => {
  gsap.set(`.${styles.thirteen}`, {
    attr: {
      'data-light-direction': config.lightDirection,
    },
  });
});

type AIGlassProps = {
  onClick?: () => void;
  motionProps?: MotionProps;
  options?: AIGlassConfig;
  classNames?: {
    container?: string;
  };
};

export const AIGlass = ({
  onClick,
  motionProps,
  options,
  classNames,
}: AIGlassProps) => {
  useEffect(() => {
    const config = { ...defaultConfig, ...options };
    twoSetter(config);
    threeSetter(config);
    sevenSetter(config);
    nineSetter(config);
    tenSetter(config);
    elevenSetter(config);
    thirteenSetter(config);
  }, [options]);

  return (
    <motion.div
      {...motionProps}
      onClick={onClick}
      className={classNames?.container}
    >
      <div
        data-theme={options?.theme}
        className={styles.container}
        style={{ '--agent-length': '16px' } as CSSProperties}
      >
        <svg width='0' height='0' style={{ position: 'absolute' }}>
          <defs>
            <filter
              id='dissolve-filter2'
              x='-200%'
              y='-200%'
              width='500%'
              height='500%'
              colorInterpolationFilters='sRGB'
              overflow='visible'
            >
              <feTurbulence
                type='fractalNoise'
                baseFrequency='0.0225'
                numOctaves='3'
                result='noise'
              ></feTurbulence>
              <feColorMatrix
                type='matrix'
                values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 40 -15'
                result='noisyAlpha'
              />
              <feComposite operator='in' in='SourceGraphic' in2='noisyAlpha' />
              <feDisplacementMap
                in='SourceGraphic'
                in2='noise'
                scale='300'
                xChannelSelector='R'
                yChannelSelector='G'
              />
            </filter>
          </defs>
        </svg>
        <div className={styles.one} />
        <div className={styles.two} />
        {!options?.reduceMotion && (
          <>
            <div className={styles.three} />
            <div className={styles.seven} />
            <div className={styles.eight} />
            <div className={styles.nine} />
            <div className={styles.ten} />
            <div className={styles.eleven} />
            <div className={styles.twelve} />
            <div className={styles.thirteen} />
          </>
        )}
      </div>
    </motion.div>
  );
};
