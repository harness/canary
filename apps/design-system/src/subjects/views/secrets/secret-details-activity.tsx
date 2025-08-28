import { FC } from 'react'

import { noop } from '@utils/viewUtils'

// Import directly from the package path
import { SecretActivityPage } from '@harnessio/ui/views'

import mockSecretActivity from './mock-secrets-activity-data.json'

const SecretDetailsActivity: FC = () => {
  const pageSize = 10

  return (
    <SecretActivityPage
      searchQuery={''}
      setSearchQuery={noop}
      isError={false}
      errorMessage=""
      currentPage={1}
      totalItems={mockSecretActivity.data.content.length}
      pageSize={pageSize}
      goToPage={noop}
      isLoading={false}
      secretActivity={mockSecretActivity.data.content.map(activity => ({
        event: activity.detail.usageDetail.usagetype,
        type: activity?.detail?.referredByEntity?.entityRef?.identifier || '',
        scope: activity?.detail?.referredByEntity?.entityRef?.scope || '',
        createdAt: activity.activityTime
      }))}
    />
  )
}

export default SecretDetailsActivity
