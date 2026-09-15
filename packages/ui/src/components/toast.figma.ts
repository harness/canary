// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=10636-13114
// source=packages/ui/src/components/toast/custom-toast.tsx
// component=CustomToast

import figma from 'figma'

const instance = figma.selectedInstance

const title = instance.findText('Toast message', { traverseInstances: true, path: ['toast-01'] }).textContent

export default {
  example: figma.code`
    <CustomToast toastId="toast-1" variant="info" title="${title}" closeButton />
  `,
  imports: ['import { CustomToast } from "@harnessio/ui/components"'],
  id: 'toast',
  metadata: {
    nestable: true
  }
}
