// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=848-42518
// source=packages/ui/src/components/tabs.tsx
// component=Tabs

import figma from 'figma'

const instance = figma.selectedInstance

const variant = instance.getEnum('variant', {
  outlined: 'outlined',
  ghost: 'ghost',
  overlined: 'overlined',
  underlined: 'underlined'
})

// The individual tab trigger variants (.TabsItemUnderlined, .TabsItemOutlined,
// .TabsItemGhost, .TabsItemOverlined) are dot-prefixed internal helper components
// in Figma and can't be published/mapped via Code Connect, so their content can't
// be resolved dynamically here. This shows a representative, illustrative example.
export default {
  example: figma.code`
    <Tabs.Root defaultValue="tab-01">
      <Tabs.List variant="${variant}">
        <Tabs.Trigger value="tab-01">Tab</Tabs.Trigger>
        <Tabs.Trigger value="tab-02">Tab</Tabs.Trigger>
      </Tabs.List>
    </Tabs.Root>
  `,
  imports: ['import { Tabs } from "@harnessio/ui/components"'],
  id: 'tabs',
  metadata: {
    nestable: false
  }
}
