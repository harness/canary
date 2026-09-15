// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=13083-809
// source=packages/ui/src/components/avatar.tsx
// component=AvatarWithTooltip

import figma from 'figma'

const instance = figma.selectedInstance

const name = instance.getString('text#874:34')

export default {
  example: figma.code`
    <AvatarWithTooltip name="${name}" tooltipProps={{ content: "${name}" }} />
  `,
  imports: ['import { AvatarWithTooltip } from "@harnessio/ui/components"'],
  id: 'avatar-hover',
  metadata: {
    nestable: true
  }
}
