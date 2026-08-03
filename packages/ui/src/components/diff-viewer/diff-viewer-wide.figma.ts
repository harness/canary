// url=https://www.figma.com/design/AIgjIyUzcuZzuVnuoOyhQE/HDS-%7C-Components-3.0?node-id=1951-145008
// source=packages/ui/src/components/diff-viewer/diff-viewer.tsx
// component=Diff/ContentView/Wide

import figma from 'figma'

export default {
  example: figma.code`
    <DiffViewer oldCode={oldCode} newCode={newCode} diffViewMode={DiffModeEnum.Unified} />
  `,
  imports: ['import { DiffViewer, DiffModeEnum } from "@harnessio/ui/components"'],
  id: 'diff-viewer-wide',
  metadata: {
    nestable: false
  }
}
