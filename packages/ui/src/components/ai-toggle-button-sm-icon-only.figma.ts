// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-21396
// source=packages/ui/src/components/toggle.tsx
// component=Toggle

import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('👁️ disabled', {
  off: false,
  on: true
})

const selected = instance.getEnum('selected', {
  off: false,
  on: true
})

export default {
  example: figma.code`
    <Toggle
      variant="ghost"
      size="sm"
      iconOnly
      prefixIcon="ai-solid"
      ${disabled ? 'disabled' : ''}
      ${selected ? 'selected' : ''}
    />
  `,
  imports: ['import { Toggle } from "@harnessio/ui/components"'],
  id: 'ai-toggle-button-sm-icon-only',
  metadata: {
    nestable: true
  }
}
