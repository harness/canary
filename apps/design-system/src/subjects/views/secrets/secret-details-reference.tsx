import { FC } from 'react'

import { noop } from '@utils/viewUtils'

// Import directly from the package path
import { SecretReferencesPage } from '@harnessio/ui/views'

// Mock data for secret references
const mockSecretReferences = [
  {
    id: 'ref-1',
    name: 'Pipeline: Main Build',
    type: 'pipeline',
    path: '/org/project/pipelines/main-build',
    scope: 'Project',
    createdAt: 1744726246997
  },
  {
    id: 'ref-2',
    name: 'Pipeline: Deploy to Production',
    type: 'pipeline',
    path: '/org/project/pipelines/deploy-prod',
    scope: 'Project',
    createdAt: 1744726246997
  },
  {
    id: 'ref-3',
    name: 'Connector: GitHub',
    type: 'connector',
    path: '/org/project/connectors/github',
    scope: 'Account',
    createdAt: 1744726246997
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
