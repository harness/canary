// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=11833-116020
// source=packages/ui/src/components/skeletons/skeleton-icon.tsx
// component=Skeleton.Icon

import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('icon-size', {
  '2xs': '2xs',
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl'
})

export default {
  example: figma.code`<Skeleton.Icon size="${size}" />`,
  imports: ['import { Skeleton } from "@harnessio/ui/components"'],
  id: 'skeleton-icon',
  metadata: {
    nestable: true
  }
}
