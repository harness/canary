import { FC, PropsWithChildren, useCallback } from 'react'

import SecretDetailsActivity from '@subjects/views/secrets/secret-details-activity'
import SecretDetailsReferences from '@subjects/views/secrets/secret-details-reference'

import { SecretDetailsLayout } from '@harnessio/ui/views'

const SecretDetailsLayoutWrapper: FC<PropsWithChildren<React.HTMLAttributes<HTMLElement>>> = () => {
  // Mock secret data for the layout
  const mockSecret = {
    identifier: 'secret-123',
    name: 'Example Secret',
    description: 'This is an example secret',
    createdAt: Date.now() - 1000 * 60 * 60 * 24 * 7, // 7 days ago
    updatedAt: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    type: 'ssh',
    usageCount: 5
  }

  // Mock backButtonTo function
  const backButtonTo = useCallback(() => '/secrets', [])

  return (
    <SecretDetailsLayout
      secret={mockSecret}
      backButtonTo={backButtonTo}
      referencesView={<SecretDetailsReferences />}
      activityView={<SecretDetailsActivity />}
    />
  )
}

export default SecretDetailsLayoutWrapper
