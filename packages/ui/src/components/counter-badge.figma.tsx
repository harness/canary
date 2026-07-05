import React from 'react'

import figma from '@figma/code-connect'

import { CounterBadge } from './counter-badge'

/**
 * Code Connect mapping — Figma "CounterBadge" (page: Badge) → <CounterBadge /> in @harnessio/ui.
 *
 * CounterBadge is the numeric-count pill; the count is passed as children.
 * Figma theme options carry an emoji prefix (e.g. "⚫ default") mapped to the
 * code theme names.
 * Node: HDS | Components 3.0, "❖ CounterBadge".
 */
figma.connect(
  CounterBadge,
  'https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1782-29559',
  {
    props: {
      number: figma.string('number-value#7030:133'),
      variant: figma.enum('variant', {
        outline: 'outline',
        secondary: 'secondary'
      }),
      theme: figma.enum('theme', {
        '⚫ default': 'default',
        '🔵 info': 'info',
        '🔴 danger': 'danger',
        '🟢 success': 'success'
      })
    },
    example: ({ number, variant, theme }) => (
      <CounterBadge variant={variant} theme={theme}>
        {number}
      </CounterBadge>
    )
  }
)
