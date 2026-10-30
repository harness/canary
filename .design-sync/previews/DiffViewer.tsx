import * as React from 'react'
import { DiffViewer } from '@harnessio/ui'

const oldCode = `pipeline:
  name: build-and-deploy
  stages:
    - name: build
      timeout: 10m
    - name: deploy
      environment: staging
`
const newCode = `pipeline:
  name: build-and-deploy
  stages:
    - name: build
      timeout: 15m
      retry: 2
    - name: deploy
      environment: production
`

export function Unified() {
  return (
    <div style={{ width: 720, padding: 16 }}>
      <DiffViewer oldCode={oldCode} newCode={newCode} />
    </div>
  )
}
