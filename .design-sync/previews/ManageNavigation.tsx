import * as React from 'react'
import { ManageNavigation } from '@harnessio/ui'

const pinned: any[] = [
  { id: 'pipelines', title: 'Pipelines', iconName: 'pipeline', to: '/pipelines' },
  { id: 'repositories', title: 'Repositories', iconName: 'repository', to: '/repos' },
  { id: 'deployments', title: 'Deployments', iconName: 'rocket', to: '/deployments' }
]
const recent: any[] = [
  { id: 'secrets', title: 'Secrets', iconName: 'key', to: '/secrets' },
  { id: 'connectors', title: 'Connectors', iconName: 'link', to: '/connectors' }
]

export function Default() {
  return (
    <ManageNavigation
      showManageNavigation
      pinnedItems={pinned}
      recentItems={recent}
      onSave={() => {}}
      onClose={() => {}}
      isSubmitting={false}
      submitted={false}
    />
  )
}

export function Saving() {
  return (
    <ManageNavigation
      showManageNavigation
      pinnedItems={pinned}
      recentItems={[]}
      onSave={() => {}}
      onClose={() => {}}
      isSubmitting
      submitted={false}
    />
  )
}
