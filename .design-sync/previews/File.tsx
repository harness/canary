import * as React from 'react'
import { Tree, File, Folder } from '@harnessio/ui'

export function StepList() {
  return (
    <div style={{ width: 420, height: 220, padding: 16 }}>
      <Tree initialExpendedItems={['build']} initialSelectedId="lint">
        <Folder element="Build" value="build" level={0} status={'success' as any} duration="2m 41s">
          <File value="lint" level={1} status={'success' as any} duration="14s">Lint</File>
          <File value="test" level={1} status={'success' as any} duration="1m 52s">Unit tests</File>
          <File value="publish" level={1} status={'running' as any} duration="--">Publish image</File>
        </Folder>
      </Tree>
    </div>
  )
}

export function Statuses() {
  return (
    <div style={{ width: 420, height: 220, padding: 16 }}>
      <Tree initialExpendedItems={['deploy']}>
        <Folder element="Deploy" value="deploy" level={0} status={'failure' as any} duration="48s">
          <File value="stg" level={1} status={'success' as any} duration="22s">Deploy staging</File>
          <File value="smoke" level={1} status={'failure' as any} duration="26s">Smoke tests</File>
          <File value="prod" level={1} status={'pending' as any}>Deploy production</File>
        </Folder>
      </Tree>
    </div>
  )
}
