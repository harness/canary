import * as React from 'react'
import { FileEditorControlBar, Tabs } from '@harnessio/ui'

export function WithPreview() {
  return (
    <div style={{ width: 640, padding: 16 }}>
      <Tabs.Root defaultValue="edit">
        <FileEditorControlBar />
      </Tabs.Root>
    </div>
  )
}

export function EditOnly() {
  return (
    <div style={{ width: 640, padding: 16 }}>
      <Tabs.Root defaultValue="edit">
        <FileEditorControlBar showPreview={false} />
      </Tabs.Root>
    </div>
  )
}
