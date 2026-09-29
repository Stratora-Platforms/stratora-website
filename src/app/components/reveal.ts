/**
 * Shared entrance-reveal settings for the homepage sections.
 *
 * The reveals used to run 600ms and trigger 100px *after* a section entered
 * the viewport, so a fast scroll landed on a section that was still near
 * transparent — it read as unloaded. Two changes fix that:
 *
 *   1. The viewport margin is positive, so the reveal starts BEFORE the
 *      section is on screen and is finished by the time it is.
 *   2. The animation is short (~320ms) and the travel is small, so even when
 *      it is caught mid-flight the text is readable.
 *
 * Staggering is capped rather than proportional: a six-item group used to
 * take 6 x 80ms = 480ms to finish, which is what made the lower items look
 * missing. `revealDelay` tops out at 150ms across any group size.
 *
 * prefers-reduced-motion is handled globally by <MotionConfig reducedMotion="user">
 * in App.tsx, which drops the transform and leaves a plain fade.
 */

export const REVEAL_DURATION = 0.32;

/** Start the reveal while the section is still below the fold. */
export const REVEAL_VIEWPORT = { once: true, margin: "0px 0px 15% 0px" } as const;

export const REVEAL = {
  initial: { opacity: 0, y: 12 },
  whileInView: { opacity: 1, y: 0 },
  viewport: REVEAL_VIEWPORT,
  transition: { duration: REVEAL_DURATION, ease: "easeOut" },
} as const;

/** Per-item delay inside a group, capped so the whole group lands inside 150ms. */
export function revealDelay(index: number, max = 0.15, step = 0.04): number {
  return Math.min(index * step, max);
}

/** REVEAL with a staggered delay for the nth item in a group. */
export function revealAt(index: number) {
  return {
    initial: REVEAL.initial,
    whileInView: REVEAL.whileInView,
    viewport: REVEAL_VIEWPORT,
    transition: { duration: REVEAL_DURATION, ease: "easeOut", delay: revealDelay(index) },
  } as const;
}
