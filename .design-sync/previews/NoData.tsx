import * as React from 'react'
import { NoData } from '@harnessio/ui'

export function Default() {
  return (
    <div style={{ width: 520, height: 360 }}>
      <NoData
        imageName="no-data-folder"
        title="No pipelines yet"
        description={['Pipelines automate build, test and deploy.', 'Create your first pipeline to get started.']}
        primaryButton={{ label: 'Create pipeline', onClick: () => {} }}
        secondaryButton={{ label: 'Import from YAML', onClick: () => {} }}
      />
    </div>
  )
}
export function Bordered() {
  return (
    <div style={{ width: 520, height: 320, padding: 16 }}>
      <NoData withBorder title="No pull requests" description={['There are no open pull requests in this repository.']} />
    </div>
  )
}
