import type { Variants } from 'framer-motion';

// Shared easing — slow, cinematic
export const easeCinema = [0.22, 1, 0.36, 1] as const;

export const fadeBlur: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)', y: 8 },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    y: 0,
    transition: { duration: 1.6, ease: easeCinema },
  },
  exit: {
    opacity: 0,
    filter: 'blur(8px)',
    y: -8,
    transition: { duration: 0.9, ease: easeCinema },
  },
};

export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 1.4, ease: easeCinema },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8, ease: easeCinema },
  },
};

export const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 1.06, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 2.2, ease: easeCinema },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    filter: 'blur(6px)',
    transition: { duration: 1, ease: easeCinema },
  },
};

export const sectionContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.8, ease: easeCinema },
  },
};
