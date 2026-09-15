// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=13702-56557
// source=packages/ui/src/components/treeview.tsx
// component=Tree

import figma from 'figma'

// TreeView is a flat visual mock of up to 20 boolean-gated `.TreeViewItemContainer` instances in
// Figma, with no represented parent/child hierarchy or dynamic per-item content — the individual
// items are dot-prefixed private sub-components and can't be mapped. This shows a representative,
// illustrative example of the recursive Tree/Folder/File API — the real tree structure, item
// count, and status per node are set by the consumer.
export default {
  example: figma.code`
    <Tree initialSelectedId="1" initialExpendedItems={['1']}>
      <Folder element="Root" value="1" level={0} status={ExecutionState.SUCCESS}>
        <File value="2" level={1} status={ExecutionState.SUCCESS}>
          File one
        </File>
        <File value="3" level={1} status={ExecutionState.RUNNING}>
          File two
        </File>
      </Folder>
    </Tree>
  `,
  imports: [
    'import { Tree, Folder, File } from "@harnessio/ui/components"',
    'import { ExecutionState } from "@harnessio/ui/types"'
  ],
  id: 'treeview',
  metadata: {
    nestable: false
  }
}
