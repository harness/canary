// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=6337-220108
// source=packages/ui/src/components/form-primitives/select.tsx
// component=Select

import figma from 'figma'

const instance = figma.selectedInstance

const hasLabel = instance.getBoolean('label#8183:85')
const label = hasLabel ? instance.findText('text', { traverseInstances: true, path: ['❖Label'] }).textContent : null

const hasDescription = instance.getBoolean('description#8183:79')
const caption = hasDescription
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
    <Select
      orientation="vertical"
      ${label ? figma.code`label="${label}"` : ''}
      ${caption ? figma.code`caption="${caption}"` : ''}
      theme="${error ? 'danger' : 'default'}"
      disabled={${disabled}}
      options={[]}
    />
  `,
  imports: ['import { Select } from "@harnessio/ui/components"'],
  id: 'select-vertical',
  metadata: {
    nestable: true
  }
}
