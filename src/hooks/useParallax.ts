import { RefObject } from 'react';
import { useScroll, useTransform, MotionValue } from 'motion/react';

interface UseParallaxOptions {
  distance?: number;
  direction?: 'up' | 'down';
  offset?: [string, string];
}

/**
 * GPU-accelerated parallax hook leveraging Motion's useScroll and useTransform.
 * Maps scroll offset directly to 3D matrix / translate3d transforms.
 */
export function useParallax(
  ref: RefObject<HTMLElement | null>,
  options: UseParallaxOptions = {}
): {
  y: MotionValue<number>;
  opacity: MotionValue<number>;
  scale: MotionValue<number>;
} {
  const {
    distance = 120,
    direction = 'up',
    offset = ['start end', 'end start'],
  } = options;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset as any,
  });

  const range = direction === 'up' ? [distance, -distance] : [-distance, distance];
  const y = useTransform(scrollYProgress, [0, 1], range);
  const opacity = useTransform(scrollYProgress, [0, 0.25, 0.75, 1], [0.6, 1, 1, 0.7]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.98]);

  return { y, opacity, scale };
}
