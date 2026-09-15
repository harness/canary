// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=8818-67606
// source=packages/ui/src/components/radio.tsx
// component=Radio.Root

import figma from 'figma'

const instance = figma.selectedInstance

const hasLabel = instance.getBoolean('top label#8818:5')
const label = hasLabel ? instance.findText('text', { traverseInstances: true, path: ['❖Label'] }).textContent : null

const error = instance.getEnum('error', { off: false, on: true })

const hasItem2 = instance.getBoolean('Item 2#8818:0')
const hasItem3 = instance.getBoolean('Item 3#8818:1')
const hasItem4 = instance.getBoolean('Item 4#8818:2')
const hasItem5 = instance.getBoolean('Item 5#8818:3')
const hasItem6 = instance.getBoolean('Item 6#8818:4')

export default {
  example: figma.code`
    <Radio.Root ${label ? `label="${label}"` : ''} error={${error}}>
      <Radio.Item value="option-1" label="Option 1" />
      ${hasItem2 ? '<Radio.Item value="option-2" label="Option 2" />' : ''}
      ${hasItem3 ? '<Radio.Item value="option-3" label="Option 3" />' : ''}
      ${hasItem4 ? '<Radio.Item value="option-4" label="Option 4" />' : ''}
      ${hasItem5 ? '<Radio.Item value="option-5" label="Option 5" />' : ''}
      ${hasItem6 ? '<Radio.Item value="option-6" label="Option 6" />' : ''}
    </Radio.Root>
  `,
  imports: ['import { Radio } from "@harnessio/ui/components"'],
  id: 'radio-group',
  metadata: {
    nestable: true
  }
}
