// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=28553-21266
// source=packages/ui/src/components/toggle-group.tsx
// component=ToggleGroup

import figma from 'figma'

const instance = figma.selectedInstance

const groupVariant = instance.getEnum('style', {
  ghost: 'ghost',
  outline: 'outline'
})

const groupSelectedVariant = instance.getEnum('variant', {
  primary: 'primary',
  secondary: 'secondary'
})

const slotKeys = ['btn-01', 'btn-02', 'btn-03', 'btn-04', 'btn-05', 'btn-06', 'btn-07']
const visibilityKeys = {
  'btn-03': 'btn-03#8845:1',
  'btn-04': 'btn-04#8845:2',
  'btn-05': 'btn-05#8845:3',
  'btn-06': 'btn-06#8845:4',
  'btn-07': 'btn-07#8935:14'
}

const items = slotKeys.filter(slotKey => {
  const visibilityKey = visibilityKeys[slotKey]
  return visibilityKey ? instance.getBoolean(visibilityKey) : true
})

export default {
  example: figma.code`
    <ToggleGroup.Root type="single" variant="${groupVariant}" selectedVariant="${groupSelectedVariant}">
      ${items.map(() => figma.code`<ToggleGroup.Item value="..." iconOnly prefixIcon="..." />`)}
    </ToggleGroup.Root>
  `,
  imports: ['import { ToggleGroup } from "@harnessio/ui/components"'],
  id: 'toggle-button-group',
  metadata: {
    nestable: true
  }
}
