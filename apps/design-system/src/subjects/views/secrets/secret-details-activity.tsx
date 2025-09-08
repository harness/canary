import { FC } from 'react'

import { noop } from '@utils/viewUtils'

import { Link } from '@harnessio/ui/components'
// Import directly from the package path
import { ScopeType, SecretActivityPage } from '@harnessio/ui/views'

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
        scope:
          activity?.detail?.referredByEntity?.entityRef?.scope === 'account'
            ? ScopeType.Account
            : activity?.detail?.referredByEntity?.entityRef?.scope === 'organization'
              ? ScopeType.Organization
              : ScopeType.Project,
        scopedPath: `${activity?.detail?.referredByEntity?.entityRef?.accountIdentifier}/${activity?.detail?.referredByEntity?.entityRef?.orgIdentifier}/${activity?.detail?.referredByEntity?.entityRef?.projectIdentifier}`,
        createdAt: activity.activityTime,
        entityRenderer: (
          <Link to="" prefixIcon="account">
            {activity?.detail?.referredByEntity?.entityRef?.identifier}
          </Link>
        )
      }))}
    />
  )
}

export default SecretDetailsActivity
