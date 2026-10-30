import * as React from 'react'
import { FileViewerControlBar, Tabs } from '@harnessio/ui'

const content = 'name: build-and-deploy\non: push\njobs:\n  build:\n    steps:\n      - run: pnpm test'

export function CodeView() {
  return (
    <div style={{ width: 760, padding: 16 }}>
      <Tabs.Root defaultValue="code">
        <FileViewerControlBar view="code" isMarkdown={false} fileBytesSize="1.2 KB" fileContent={content} url="https://example.com/raw" handleDownloadFile={() => {}} handleEditFile={() => {}} handleOpenDeleteDialog={() => {}} />
      </Tabs.Root>
    </div>
  )
}

export function MarkdownLfs() {
  return (
    <div style={{ width: 760, padding: 16 }}>
      <Tabs.Root defaultValue="preview">
        <FileViewerControlBar view="preview" isMarkdown isGitLfsObject fileBytesSize="48 KB" fileContent={content} url="https://example.com/raw" handleDownloadFile={() => {}} handleEditFile={() => {}} handleOpenDeleteDialog={() => {}} />
      </Tabs.Root>
    </div>
  )
}
