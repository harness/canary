import { type JSX } from 'react'

import { cn } from '@/utils'

import { GlowCardInnerProps, GlowCardRootProps } from './glow-card-types'

/** Glow colors are CSS tokens on `.cn-glow-card` — see `glow-card-types.ts`. */
function Root({ children, className, ...props }: GlowCardRootProps): JSX.Element {
  return (
    <div className={cn('cn-glow-card', className)} {...props}>
      <div className="cn-glow-card-halo" aria-hidden />
      <div className="cn-glow-card-ring">{children}</div>
    </div>
  )
}

function Inner({ children, className, ...props }: GlowCardInnerProps): JSX.Element {
  return (
    <div className={cn('cn-glow-card-inner', className)} {...props}>
      {children}
    </div>
  )
}

export const GlowCard = {
  Root,
  Inner
}

export type * from './glow-card-types'
