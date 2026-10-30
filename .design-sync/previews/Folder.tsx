import * as React from 'react'
import { Tree, File, Folder } from '@harnessio/ui'

export function Nested() {
  return (
    <div style={{ width: 420, height: 280, padding: 16 }}>
      <Tree initialExpendedItems={['ci', 'ci-build']}>
        <Folder element="CI" value="ci" level={0} status={'success' as any} duration="5m 03s">
          <Folder element="Build" value="ci-build" level={1} status={'success' as any} duration="3m 10s">
            <File value="compile" level={2} status={'success' as any} duration="2m 01s">Compile</File>
            <File value="package" level={2} status={'success' as any} duration="1m 09s">Package</File>
          </Folder>
          <File value="scan" level={1} status={'success' as any} duration="1m 53s">Security scan</File>
        </Folder>
      </Tree>
    </div>
  )
}

export function Collapsed() {
  return (
    <div style={{ width: 420, height: 160, padding: 16 }}>
      <Tree initialExpendedItems={[]}>
        <Folder element="Release" value="release" level={0} status={'running' as any} duration="--">
          <File value="tag" level={1} status={'running' as any}>Create tag</File>
        </Folder>
        <Folder element="Notify" value="notify" level={0} status={'pending' as any}>
          <File value="slack" level={1} status={'pending' as any}>Slack message</File>
        </Folder>
      </Tree>
    </div>
  )
}
