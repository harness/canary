import React from 'react'

import figma from '@figma/code-connect'

import { Tag } from './tag'

/**
 * Code Connect mapping — Figma "Tag" (page: Tag) → <Tag /> in @harnessio/ui.
 *
 * Tag is the category / descriptive-label chip. Figma theme options carry an
 * emoji prefix (e.g. "⚫ gray"); we map them to the code theme names.
 * Node: HDS | Components 3.0, "❖ tag / default".
 */
figma.connect(Tag, 'https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1444-10547', {
  props: {
    text: figma.string('text#1444:4'),
    variant: figma.enum('variant', {
      outline: 'outline',
      secondary: 'secondary'
    }),
    size: figma.enum('size', {
      md: 'md',
      sm: 'sm'
    }),
    theme: figma.enum('theme', {
      '⚫ gray': 'gray',
      '🔵 blue': 'blue',
      '🟤 brown': 'brown',
      '🔵 cyan': 'cyan',
      '🟢 green': 'green',
      '🔵 indigo': 'indigo',
      '🟣 violet': 'violet',
      '🟠 orange': 'orange',
      '🟢 mint': 'mint',
      '🟣 pink': 'pink',
      '🔴 red': 'red',
      '🟣 purple': 'purple',
      '🟡 yellow': 'yellow'
    }),
    rounded: figma.boolean('rounded')
    // NOTE: Tag's `icon` prop is an icon-name string (IconV2NamesType), not a
    // rendered node, so the Figma icon instance is not mapped here.
  },
  example: ({ text, variant, size, theme, rounded }) => (
    <Tag value={text} variant={variant} size={size} theme={theme} rounded={rounded} />
  )
})
