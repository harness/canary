// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=16649-13647
// source=packages/ui/src/components/card-select.tsx
// component=CardSelect

import figma from 'figma'

const instance = figma.selectedInstance

const title = instance.getString('title#6117:0')

const hasDescription = instance.getBoolean('description#6117:8')
const description = hasDescription ? instance.getString('description text#6117:4') : null

const hasIcon = instance.getBoolean('icon#6130:0')
const icon = hasIcon ? instance.getInstanceSwap('↳ icon#6130:4') : null
let iconCode
if (icon && icon.type === 'INSTANCE') {
  iconCode = icon.executeTemplate().example
}

const disabled = instance.getEnum('state', {
  default: false,
  hover: false,
  disabled: true
})

export default {
  example: figma.code`
    <CardSelect.Root type="single">
      <CardSelect.Item
        value="option"
        ${iconCode ? figma.code`icon={${iconCode}}` : ''}
        ${disabled ? 'disabled' : ''}
      >
        <CardSelect.Title>${title}</CardSelect.Title>
        ${description ? figma.code`<CardSelect.Description>${description}</CardSelect.Description>` : ''}
      </CardSelect.Item>
    </CardSelect.Root>
  `,
  imports: ['import { CardSelect } from "@harnessio/ui/components"'],
  id: 'card-select-radio',
  metadata: {
    nestable: true
  }
}
