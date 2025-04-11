import { NoData, SkeletonList, SkeletonTable, Table } from '@/components'
import { timeAgo } from '@utils/utils'

import { ConnectorReferenceItem, ConnectorReferenceListProps } from './types'

const Title = ({ title }: { title: string }): JSX.Element => (
  <span className="text-cn-foreground-1 max-w-full truncate text-sm font-medium leading-tight tracking-tight">
    {title}
  </span>
)
const Description = ({ description }: { description: string }): JSX.Element => (
  <span className="text-12 text-cn-foreground-4 max-w-full truncate font-normal leading-none tracking-tight">
    {description}
  </span>
)

const ConnectorDetailsReferenceList = ({
  entities,
  useTranslationStore,
  isLoading,
  toEntity,
  toScope
}: ConnectorReferenceListProps): JSX.Element => {
  const { t } = useTranslationStore()
  const content = entities?.content
  if (isLoading) {
    return <SkeletonList />
  }

  if (!content.length) {
    return (
      <NoData
        withBorder
        className="min-h-[65vh]"
        textWrapperClassName="max-w-[350px]"
        iconName="no-data-cog"
        title={t('views:noData.noEntities', 'No entities yet')}
        description={[t('views:noData.noEntitiesDescription', 'There are no entities yet.')]}
      />
    )
  }

  return (
    <Table.Root
      className={isLoading ? '[mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)]' : ''}
      variant="asStackedList"
    >
      <Table.Header>
        <Table.Row>
          <Table.Head className="text-cn-foreground-4 w-96">Entity</Table.Head>
          <Table.Head className="text-cn-foreground-4 w-96">Scope</Table.Head>
          <Table.Head className="text-cn-foreground-4 w-44 text-right">Created</Table.Head>
        </Table.Row>
      </Table.Header>
      {isLoading ? (
        <SkeletonTable countRows={12} countColumns={5} />
      ) : (
        <Table.Body>
          {content.map(({ referredByEntity, createdAt }: ConnectorReferenceItem) => {
            const { name, type, entityRef } = referredByEntity
            const { scope } = entityRef
            const identifier = entityRef?.identifier || name
            return (
              <Table.Row key={identifier} className="cursor-pointer">
                <Table.Cell onClick={() => toEntity?.(identifier)} className="max-w-80 self-start truncate">
                  <div className="flex flex-col gap-2.5">
                    <Title title={identifier} />
                    <Description description={`Type: ${type}`} />
                  </div>
                </Table.Cell>
                <Table.Cell
                  onClick={() => toScope?.(scope)}
                  className="text-cn-foreground-accent max-w-80 content-center truncate font-medium"
                >
                  {scope}
                </Table.Cell>

                <Table.Cell
                  onClick={() => toEntity?.(identifier)}
                  className="text-cn-foreground-4 max-w-full content-center truncate text-right text-sm font-normal leading-tight tracking-tight"
                >
                  {createdAt ? timeAgo(createdAt) : null}
                </Table.Cell>
              </Table.Row>
            )
          })}
        </Table.Body>
      )}
    </Table.Root>
  )
}
export default ConnectorDetailsReferenceList
