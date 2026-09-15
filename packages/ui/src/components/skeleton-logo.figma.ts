// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=11833-116013
// source=packages/ui/src/components/skeletons/skeleton-logo.tsx
// component=Skeleton.Logo

import figma from 'figma'

const instance = figma.selectedInstance

const size = instance.getEnum('size', { sm: 'sm', md: 'md', lg: 'lg' })

export default {
  example: figma.code`<Skeleton.Logo size="${size}" />`,
  imports: ['import { Skeleton } from "@harnessio/ui/components"'],
  id: 'skeleton-logo',
  metadata: {
    nestable: true
  }
}
