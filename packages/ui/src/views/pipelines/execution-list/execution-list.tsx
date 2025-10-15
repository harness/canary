import { IconV2, NoData, Skeleton, StackedList, TimeAgoCard } from '@/components'
import { useTranslation } from '@/context'
import { timeDistance } from '@/utils'
import { PipelineExecutionStatus } from '@/views'

import { ExecutionStatusIcon } from '../components/execution-status-icon'
import { IExecutionListProps, IExecutionType } from './types'

const Title = ({ status, title }: { status?: PipelineExecutionStatus; title: string }) => {
  return (
    <div className="flex items-center gap-1.5">
      {status && <ExecutionStatusIcon status={status} />}
      <span className="truncate text-3 font-medium leading-snug">{title}</span>
    </div>
  )
}

const Description = ({
  sha,
  description,
  version
}: {
  sha?: string
  description?: IExecutionType
  version?: string
}) => {
  return (
    <div className="inline-flex max-w-full items-center gap-2 overflow-hidden pl-cn-xl text-2 leading-tight">
      {description && <span className="w-full overflow-hidden break-words text-cn-3">{description}</span>}
      {version && (
        <div className="flex items-center gap-1">
          <IconV2 size="2xs" name="version" />
          {version}
        </div>
      )}
      {sha && (
        <div className="flex h-4 items-center gap-1 rounded bg-cn-gray-secondary px-cn-2xs text-1 text-cn-1">
          <IconV2 className="text-cn-3" size="2xs" name="git-commit" />
          {sha?.slice(0, 7)}
        </div>
      )}
    </div>
  )
}

export const ExecutionList = ({
  executions,
  handleResetQuery,
  isLoading,
  query,
  handleExecutePipeline
}: IExecutionListProps) => {
  const noData = !executions || executions.length === 0

  const { t } = useTranslation()

  if (isLoading) {
    return <Skeleton.List />
  }

  if (noData) {
    return query ? (
      <StackedList.Root className="grow place-content-center">
        <NoData
          imageName="no-search-magnifying-glass"
          title="No search results"
          description={[
            t('views:noData.checkSpelling', 'Check your spelling and filter options,'),
            t('views:noData.changeSearch', 'or search for a different keyword.')
          ]}
          secondaryButton={{
            label: t('views:noData.clearSearch', 'Clear search'),
            onClick: handleResetQuery
          }}
        />
      </StackedList.Root>
    ) : (
      <NoData
        imageName="no-data-folder"
        title="No executions yet"
        description={['There are no executions in this project yet.']}
        primaryButton={{
          label: 'Execute pipeline',
          onClick: handleExecutePipeline
        }}
      />
    )
  }

  return (
    <StackedList.Root>
      {executions.map(execution => (
        <StackedList.Item key={execution.name} paddingY="sm" to={execution.id}>
          <StackedList.Field
            title={<Title status={execution.status} title={execution.name || ''} />}
            description={
              <Description sha={execution.sha} description={execution.description} version={execution.version} />
            }
          />
          <StackedList.Field
            title={`${timeDistance(execution.finished, execution.started)}`}
            description={<TimeAgoCard timestamp={execution.started} />}
            titleColor="foreground-2"
            right
          />
        </StackedList.Item>
      ))}
    </StackedList.Root>
  )
}
