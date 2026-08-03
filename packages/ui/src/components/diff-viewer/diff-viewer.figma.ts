// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1951-126834
// source=packages/ui/src/components/diff-viewer/diff-viewer.tsx
// component=Diff/ContentView/Split

import figma from 'figma'

export default {
  example: figma.code`
    <DiffViewer oldCode={oldCode} newCode={newCode} diffViewMode={DiffModeEnum.Split} />
  `,
  imports: ['import { DiffViewer, DiffModeEnum } from "@harnessio/ui/components"'],
  id: 'diff-viewer-split',
  metadata: {
    nestable: false
  }
}
