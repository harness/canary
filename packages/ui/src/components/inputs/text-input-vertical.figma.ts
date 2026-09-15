// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=992-7081
// source=packages/ui/src/components/inputs/text-input.tsx
// component=TextInput

import figma from 'figma'

const instance = figma.selectedInstance

const hasLabel = instance.getBoolean('label#65:9')
const label = hasLabel ? instance.findText('text', { traverseInstances: true, path: ['❖Label'] }).textContent : null

const hasCaption = instance.getBoolean('caption#334:40')
const caption = hasCaption
  ? instance.findText('description', { traverseInstances: true, path: ['❖Description'] }).textContent
  : null

const theme = instance.getEnum('theme', {
  '⚫ default': 'default',
  '🔴 danger': 'danger',
  '🟡 warning': 'warning',
  '🟢 success': 'success'
})

const disabled = instance.getEnum('disabled', {
  off: false,
  on: true
})

const readOnly = instance.getEnum('readOnly', {
  off: false,
  on: true
})

export default {
  example: figma.code`
    <TextInput
      orientation="vertical"
      ${label ? figma.code`label="${label}"` : ''}
      ${caption ? figma.code`caption="${caption}"` : ''}
      theme="${theme}"
      disabled={${disabled}}
      readOnly={${readOnly}}
      placeholder="Placeholder text"
    />
  `,
  imports: ['import { TextInput } from "@harnessio/ui/components"'],
  id: 'text-input-vertical',
  metadata: {
    nestable: true
  }
}
