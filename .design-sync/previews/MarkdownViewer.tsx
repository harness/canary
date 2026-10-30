import * as React from 'react'
import { MarkdownViewer } from '@harnessio/ui'

const notes = `## Release 2.4.0

This release speeds up pipeline **cache restores** and fixes flaky \`deploy-staging\` runs.

- Parallel stage execution is now the default
- Added retry policy to the *Deploy* step
- Removed deprecated \`legacy-runner\` option

| Stage | Duration |
| --- | --- |
| Build | 2m 14s |
| Test | 4m 02s |
`

export function ReleaseNotes() {
  return (
    <div style={{ width: 560, padding: 16 }}>
      <MarkdownViewer source={notes} />
    </div>
  )
}

export function Small() {
  return (
    <div style={{ width: 560, padding: 16 }}>
      <MarkdownViewer variant="sm" withBorder muted source={'Merged **#482** into `main`. Pipeline passed in 6m 16s.\n\n- [x] Unit tests\n- [ ] Manual QA'} />
    </div>
  )
}

export function WithCode() {
  return (
    <div style={{ width: 560, padding: 16 }}>
      <MarkdownViewer source={'Run the build locally:\n\n```bash\npnpm install\npnpm build\n```\n'} />
    </div>
  )
}
