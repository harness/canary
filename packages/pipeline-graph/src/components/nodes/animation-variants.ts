import { Variants } from 'framer-motion'

/**
 * Single source of truth for the pipeline-graph node expand/collapse + child-fade animation.
 *
 * Previously `containerVariants` was duplicated verbatim in serial-container.tsx and
 * parallel-container.tsx, and `itemVariants` lived privately in leaf-container.tsx; the platformUI
 * preview nodes kept yet another hand-maintained copy (`childPreviewVariants`). They are consolidated
 * here so the regular-stage grow and the chained/template preview grow stay visually identical and
 * drift can't creep back in. Consumers (including platformUI) import these from the package root.
 *
 * How the child fade works: a container's children-wrapping `motion.div` uses {@link containerVariants}
 * whose `visible` carries `staggerChildren`/`delayChildren`. Each child leaf uses {@link itemVariants}
 * but sets NO `initial`/`animate`/`exit` of its own, so it INHERITS the parent's variant label and is
 * sequenced by the parent's stagger. The fade therefore runs ONLY when the parent actually transitions
 * `hidden -> visible` (i.e. `initial === 'hidden'`); a parent mounted at `initial={false}` snaps
 * straight to `visible` and no child fade occurs.
 */

/** Shared stagger timing so every container grow (root serial/parallel + nested top-level row) matches. */
export const CHILD_STAGGER = 0.05
export const CHILD_STAGGER_DELAY = 0.3

/**
 * Children-wrapper variants for serial/parallel containers (and the platformUI preview card wrapper):
 * a height/width `auto` reveal with an opacity tween, plus the child stagger that drives the leaf fade.
 * `hidden.opacity` is 1 on purpose — the box reveals via height/width, the per-child fade is `itemVariants`.
 */
export const containerVariants: Variants = {
  hidden: {
    height: 0,
    width: 0,
    opacity: 1,
    scale: 1,
    x: 0
  },
  visible: {
    height: 'auto',
    width: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.3, ease: 'easeOut' },
      width: { duration: 0.3, ease: 'easeOut' },
      opacity: { duration: 0.2 },
      staggerChildren: CHILD_STAGGER,
      delayChildren: CHILD_STAGGER_DELAY
    }
  },
  exit: {
    opacity: 0,
    height: 0,
    width: 0,
    transformOrigin: 'top left',
    scale: 0,
    transition: {
      when: 'afterChildren',
      ease: 'easeOut',
      height: { duration: 0.3 },
      width: { duration: 0.3 },
      staggerChildren: CHILD_STAGGER,
      staggerDirection: -1
    }
  }
}

/** Per-leaf fade. Inherits its label from the parent container; no own initial/animate/exit. */
export const itemVariants: Variants = {
  hidden: { opacity: 0, x: 0 },
  visible: { opacity: 1, x: 0, transition: { ease: 'easeOut', duration: 0.1 } },
  exit: { opacity: 0, x: -30, transition: { duration: 0.1, ease: 'easeOut' } }
}
