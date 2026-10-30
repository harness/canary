import * as React from 'react'
import { Tree, Folder, File } from '@harnessio/ui'

export function PipelineStages() {
  return (
    <div style={{ width: 380, height: 260, padding: 16 }}>
      <Tree initialExpendedItems={['build', 'deploy']} initialSelectedId="unit">
        <Folder value="build" element="Build" level={0} status={'success' as any} duration="2m 14s">
          <File value="compile" level={1} status={'success' as any} duration="48s">Compile</File>
          <File value="unit" level={1} status={'success' as any} duration="1m 12s">Unit tests</File>
        </Folder>
        <Folder value="deploy" element="Deploy" level={0} status={'running' as any} duration="1m 03s">
          <File value="staging" level={1} status={'success' as any} duration="31s">Staging</File>
          <File value="prod" level={1} status={'running' as any} duration="32s">Production</File>
        </Folder>
        <File value="notify" level={0} status={'pending' as any}>Notify Slack</File>
      </Tree>
    </div>
  )
}
