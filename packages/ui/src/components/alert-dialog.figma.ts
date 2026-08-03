// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=8173-74618
// source=packages/ui/src/components/alert-dialog.tsx
// component=AlertDialog

import figma from 'figma'

const instance = figma.selectedInstance

const isDanger = instance.getEnum('theme', { danger: true })

const hasTitle = instance.getBoolean('title#6394:20')
const title = hasTitle ? instance.getString('title text#6394:0') : null

export default {
  example: figma.code`
    <AlertDialog.Root onConfirm={() => {}}${isDanger ? ' theme="danger"' : ''}>
      <AlertDialog.Content title="${title ?? 'Are you sure?'}">
        Content
      </AlertDialog.Content>
    </AlertDialog.Root>
  `,
  imports: ['import { AlertDialog } from "@harnessio/ui/components"'],
  id: 'alert-dialog',
  metadata: {
    nestable: false
  }
}
