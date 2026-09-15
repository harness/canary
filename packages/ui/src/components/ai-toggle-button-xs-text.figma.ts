// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-21448
// source=packages/ui/src/components/toggle.tsx
// component=Toggle

import figma from 'figma'

const instance = figma.selectedInstance

const label = instance.getString('button text#12751:24')

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
      size="xs"
      prefixIcon="ai-solid"
      ${disabled ? 'disabled' : ''}
      ${selected ? 'selected' : ''}
      text="${label}"
    />
  `,
  imports: ['import { Toggle } from "@harnessio/ui/components"'],
  id: 'ai-toggle-button-xs-text',
  metadata: {
    nestable: true
  }
}
