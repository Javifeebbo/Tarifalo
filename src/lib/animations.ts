import type { Variants, Transition } from "framer-motion";

/** Ported 1:1 from the retired vanilla prototype's easing curves. */
export const SPRING: [number, number, number, number] = [0.34, 1.56, 0.64, 1];
export const GRAVITY: [number, number, number, number] = [0.16, 1, 0.3, 1];
export const SNAP: [number, number, number, number] = [0.4, 0, 1, 1];

/**
 * Default enter recipe (Jakub Krehel).
 * Every scroll-reveal and mount animation on this page uses this transition
 * shape unless a component has a documented reason not to.
 */
export const enterTransition: Transition = {
  type: "spring",
  duration: 0.45,
  bounce: 0,
};

export const enterFade: Variants = {
  hidden: { opacity: 0, y: 8, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: enterTransition,
  },
};

/** Parent wrapper for staggered children (hero, ledger rows). */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

/** Hover lift used on buttons and ledger rows. */
export const hoverLift = {
  y: -3,
  transition: { type: "spring", duration: 0.3, bounce: 0 } as Transition,
};

export const tapPress = {
  scale: 0.97,
  transition: { type: "spring", duration: 0.2, bounce: 0 } as Transition,
};
