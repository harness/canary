// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=739-17428
// source=packages/ui/src/components/radio.tsx
// component=Radio.Item

import figma from 'figma'

const instance = figma.selectedInstance

const disabled = instance.getEnum('disabled', {
  off: false,
  on: true
})

const radioItemOnly = instance.getEnum('radio-item-only', {
  off: false,
  on: true
})

const showDescription = instance.getBoolean('show description#428:0')
const description = instance.getString('description text#428:5')

const label = radioItemOnly
  ? null
  : instance.findText('text', { traverseInstances: true, path: ['❖Label'] }).textContent

export default {
  example: figma.code`
    <Radio.Item
      value="${label || ''}"
      disabled={${disabled}}
      ${label ? figma.code`label="${label}"` : ''}
      ${showDescription ? figma.code`caption="${description}"` : ''}
    />
  `,
  imports: ['import { Radio } from "@harnessio/ui/components"'],
  id: 'radio',
  metadata: {
    nestable: true
  }
}
