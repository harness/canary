import { HTMLAttributes, PropsWithChildren } from 'react'

/**
 * GlowCard layout tokens — set on `GlowCard.Root` (`.cn-glow-card`) or a parent.
 *
 * **Palette** — recolor the whole sweep:
 * - `--cn-comp-glow-card-color-blue`
 * - `--cn-comp-glow-card-color-sky`
 * - `--cn-comp-glow-card-color-orange`
 * - `--cn-comp-glow-card-color-amber`
 * - `--cn-comp-glow-card-color-yellow`
 * - `--cn-comp-glow-card-color-gold`
 * - `--cn-comp-glow-card-color-white`
 *
 * **Halo gradient stops** — override individual stops or their alpha mix:
 * - `--cn-comp-glow-card-halo-alpha-1` … `--cn-comp-glow-card-halo-alpha-7`
 * - `--cn-comp-glow-card-halo-base-stop-1` … `--cn-comp-glow-card-halo-base-stop-7`
 *
 * **Ring gradient stops** — override individual stops or rely on palette:
 * - `--cn-comp-glow-card-ring-stop-1` … `--cn-comp-glow-card-ring-stop-5`
 *
 * **Opacity & blur**
 * - `--cn-comp-glow-card-halo-opacity-idle` (default `0`)
 * - `--cn-comp-glow-card-halo-opacity-active` (default `1`; `0.85` in dark via `--cn-comp-glow-card-halo-opacity-active-dark`)
 * - `--cn-comp-glow-card-halo-blur` (default `14px`)
 *
 * **Layout & motion**
 * - `--cn-comp-glow-card-radius`, `--cn-comp-glow-card-halo-radius`, `--cn-comp-glow-card-duration`
 * - `--cn-comp-glow-card-rotation-count` — full 360° sweeps per hover/focus (default `3`; set `infinite` for continuous rotation)
 * - `--cn-comp-glow-card-ring-padding`, `--cn-comp-glow-card-idle-ring`
 * - `--cn-comp-glow-card-reduced-angle` (fixed angle when `prefers-reduced-motion`)
 */
export type GlowCardRootProps = HTMLAttributes<HTMLDivElement>

export type GlowCardInnerProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>
