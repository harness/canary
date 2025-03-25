import { Icon, NoData, SkeletonList, StackedList } from '@/components'
import { useRouterContext } from '@/context'
import { TFunction } from 'i18next'

import { ConnectorItem } from '../types'
import { TranslationStore } from './types'

interface PageProps {
  connectors: ConnectorItem[]
  useTranslationStore: () => TranslationStore
  isLoading: boolean
}

const Title = ({ title }: { title: string }) => (
  <div className="inline-flex items-center gap-2.5">
    <span className="max-w-full truncate font-medium">{title}</span>
  </div>
)

export function ConnectorsList({ connectors, useTranslationStore, isLoading }: PageProps) {
  const { Link } = useRouterContext()
  const { t } = useTranslationStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (!connectors.length) {
    return (
      <NoData
        withBorder
        iconName="no-data-cog"
        title={t('views:noData.noConnectors', 'No connectors yet')}
        description={[
          t('views:noData.noConnectorsProject', 'There are no connectors in this project yet.'),
          t('views:noData.createOrImportConnectors', 'Create new or import an existing connector.')
        ]}
      />
    )
  }

  return (
    <StackedList.Root>
      {connectors.map((item, idx) => {
        const connector = item.connector
        return (
          <Link
            key={connector?.identifier}
            to={`/connectors/${connector?.identifier}`}
            className={idx === connectors.length - 1 ? 'border-b border-background-3' : ''}
          >
            <StackedList.Item
              thumbnail={<Icon name="connectors" size={16} className="text-foreground-5" />}
              isLast={idx === connectors.length - 1}
            >
              <StackedList.Field
                primary
                description={<span className="max-w-full truncate">{item?.connector?.description}</span>}
                title={<Title title={connector?.name ?? ''} />}
                className="flex max-w-[80%] gap-1.5 text-wrap"
              />
            </StackedList.Item>
          </Link>
        )
      })}
    </StackedList.Root>
  )
}
