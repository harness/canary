import { FC } from 'react'

import { noop } from '@utils/viewUtils'

import { IconV2NamesType } from '@harnessio/ui/components'
// Import directly from the package path
import { ScopeType, SecretReferencesPage } from '@harnessio/ui/views'

// Mock data for secret references
const mockSecretReferences = [
  {
    id: 'ref-1',
    name: 'Pipeline: Main Build',
    type: 'pipeline',
    path: '/org/project/pipelines/main-build',
    scope: 'Project' as ScopeType,
    createdAt: 1744726246997,
    scopedPath: '/org/project/pipelines/main-build',
    iconType: 'pipeline' as IconV2NamesType,
    rowLink: '/org/project/pipelines/main-build'
  },
  {
    id: 'ref-2',
    name: 'Pipeline: Deploy to Production',
    type: 'pipeline',
    path: '/org/project/pipelines/deploy-prod',
    scope: 'Project' as ScopeType,
    createdAt: 1744726246997,
    scopedPath: '/org/project/pipelines/deploy-prod',
    iconType: 'pipeline' as IconV2NamesType,
    rowLink: '/org/project/pipelines/deploy-prod'
  },
  {
    id: 'ref-3',
    name: 'Connector: GitHub',
    type: 'connector',
    path: '/org/project/connectors/github',
    scope: 'Account' as ScopeType,
    createdAt: 1744726246997,
    scopedPath: '/org/project/connectors/github',
    iconType: 'connector' as IconV2NamesType,
    rowLink: '/org/project/connectors/github'
  }
]

const SecretDetailsReferences: FC = () => {
  const pageSize = 10

  return (
    <SecretReferencesPage
      searchQuery={''}
      setSearchQuery={noop}
      isError={false}
      errorMessage=""
      currentPage={1}
      totalItems={mockSecretReferences.length}
      pageSize={pageSize}
      goToPage={noop}
      isLoading={false}
      secretReferences={mockSecretReferences}
    />
  )
}

export default SecretDetailsReferences
