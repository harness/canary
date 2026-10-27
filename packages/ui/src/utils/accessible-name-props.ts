/**
 * Props that give a 2xs action button an accessible name. `title` is optional on the action
 * buttons, so TypeScript cannot prove a name exists: use it as the aria-label when there is one,
 * and fall back to the explicit opt-out when there is not, which leaves a title-less action
 * button rendering exactly as it did before. Kept out of the utils barrel on purpose, so it is
 * not public API.
 */
export const accessibleNameProps = (title?: string) =>
  title ? { 'aria-label': title } : { ignoreIconOnlyTooltip: true as const }
