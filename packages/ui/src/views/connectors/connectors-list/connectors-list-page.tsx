import { FC } from 'react'

import { NoData, Pagination, Spacer } from '@/components'
import { useRouterContext } from '@/context'
import { SandboxLayout } from '@/views'
import { noop } from 'lodash-es'

import { ConnectorsList } from './connectors-list'
import { ConnectorListPageProps } from './types'

const ConnectorListPage: FC<ConnectorListPageProps> = ({ isError, errorMessage, useTranslationStore, ...props }) => {
  const { t } = useTranslationStore()
  const { navigate } = useRouterContext()

  const mockPageHeaders = { totalPages: 1, page: 1, setPage: noop }

  if (isError) {
    return (
      <NoData
        textWrapperClassName="max-w-[350px]"
        iconName="no-data-error"
        title={t('views:noData.errorApiTitle', 'Failed to load connectors', {
          type: 'connectors'
        })}
        description={[
          errorMessage ||
            t(
              'views:noData.errorApiDescription',
              'An error occurred while loading the data. Please try again and reload the page.'
            )
        ]}
        primaryButton={{
          label: t('views:notFound.button', 'Reload page'),
          onClick: () => {
            navigate(0) // Reload the page
          }
        }}
      />
    )
  }

  return (
    <SandboxLayout.Main>
      <SandboxLayout.Content>
        <Spacer size={5} />
        <ConnectorsList useTranslationStore={useTranslationStore} {...props} />
        <Pagination
          totalPages={mockPageHeaders.totalPages}
          currentPage={mockPageHeaders.page}
          goToPage={mockPageHeaders.setPage}
          t={t}
        />
      </SandboxLayout.Content>
    </SandboxLayout.Main>
  )
}

export { ConnectorListPage }
