import React from 'react'

import figma from '@figma/code-connect'

import { StatusBadge } from './status-badge'

/**
 * Code Connect mapping — Figma "StatusBadge" (page: Badge) → <StatusBadge /> in @harnessio/ui.
 *
 * StatusBadge is the state / status indicator. The `status` variant renders a
 * leading colored dot. Figma theme options carry an emoji prefix
 * (e.g. "⚫ muted") that we map to the code theme names.
 * Node: HDS | Components 3.0, "❖ StatusBadge".
 */
figma.connect(
  StatusBadge,
  'https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1293-5995',
  {
    props: {
      children: figma.string('text'),
      variant: figma.enum('variant', {
        primary: 'primary',
        secondary: 'secondary',
        outline: 'outline',
        ghost: 'ghost',
        status: 'status'
      }),
      size: figma.enum('size', {
        md: 'md',
        sm: 'sm'
      }),
      theme: figma.enum('theme', {
        '⚫ muted': 'muted',
        '🟢 success': 'success',
        '🔴 danger': 'danger',
        '🟡 warning': 'warning',
        '🔵 info': 'info',
        '🟣 merged': 'merged',
        '🟠 risk': 'risk'
      })
      // NOTE: StatusBadge's `icon` prop is an icon-name string (keyof IconNameMapV2),
      // not a rendered node, so the Figma icon instance is not mapped here.
    },
    example: ({ children, variant, size, theme }) => (
      <StatusBadge variant={variant} size={size} theme={theme}>
        {children}
      </StatusBadge>
    )
  }
)
