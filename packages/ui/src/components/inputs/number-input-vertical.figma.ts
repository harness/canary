// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=5640-52051
// source=packages/ui/src/components/inputs/number-input.tsx
// component=NumberInput

import figma from 'figma'

const instance = figma.selectedInstance

const hasCaption = instance.getBoolean('caption#5640:15')
const caption = hasCaption
  ? instance.findText('description', { traverseInstances: true, path: ['❖Description'] }).textContent
  : null

const disabled = instance.getEnum('👁️ disabled', {
  off: false,
  on: true
})

const error = instance.getEnum('error', {
  off: false,
  on: true
})

export default {
  example: figma.code`
    <NumberInput
      orientation="vertical"
      ${caption ? figma.code`caption="${caption}"` : ''}
      disabled={${disabled}}
      theme="${error ? 'danger' : 'default'}"
      placeholder="0"
    />
  `,
  imports: ['import { NumberInput } from "@harnessio/ui/components"'],
  id: 'number-input-vertical',
  metadata: {
    nestable: true
  }
}
