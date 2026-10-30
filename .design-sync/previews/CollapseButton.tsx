import * as React from 'react'
import { Tree, Folder, File, CollapseButton } from '@harnessio/ui'

const elements: any[] = [
  {
    id: 'build',
    name: 'Build',
    status: 'success',
    children: [
      { id: 'compile', name: 'Compile', status: 'success' },
      { id: 'unit', name: 'Unit tests', status: 'success' }
    ]
  },
  {
    id: 'deploy',
    name: 'Deploy',
    status: 'running',
    children: [{ id: 'staging', name: 'Staging', status: 'running' }]
  }
]

export function WithTree() {
  return (
    <div style={{ position: 'relative', width: 320, height: 260, padding: 8 }}>
      <Tree elements={elements} initialExpendedItems={['build']} style={{ height: 220 }}>
        <Folder value="build" element="Build" status={'success' as any} level={0}>
          <File value="compile" status={'success' as any} level={1}>Compile</File>
          <File value="unit" status={'success' as any} level={1}>Unit tests</File>
        </Folder>
        <Folder value="deploy" element="Deploy" status={'running' as any} level={0}>
          <File value="staging" status={'running' as any} level={1}>Staging</File>
        </Folder>
        <CollapseButton elements={elements}>Expand all</CollapseButton>
      </Tree>
    </div>
  )
}
