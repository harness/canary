import { IconV2, NoData, SkeletonList, StackedList, TimeAgoCard } from '@/components'
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
    <div className="inline-flex max-w-full items-center gap-2 overflow-hidden pl-[24px] text-2 leading-tight">
      {description && <span className="w-full overflow-hidden break-words text-cn-foreground-3">{description}</span>}
      {version && (
        <div className="flex items-center gap-1">
          <IconV2 size="2xs" name="version" />
          {version}
        </div>
      )}
      {sha && (
        <div className="flex h-4 items-center gap-1 rounded bg-cn-background-8 px-1.5 text-1 text-cn-foreground-1">
          <IconV2 className="text-icons-9" size="2xs" name="git-commit" />
          {sha?.slice(0, 7)}
        </div>
      )}
    </div>
  )
}

export const ExecutionList = ({
  executions,
  LinkComponent,
  handleResetQuery,
  isLoading,
  query,
  handleExecutePipeline
}: IExecutionListProps) => {
  const noData = !executions || executions.length === 0

  const { t } = useTranslation()

  if (isLoading) {
    return <SkeletonList />
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
          primaryButton={{
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
      {executions.map((execution, idx) => (
        <LinkComponent key={execution.id} to={execution.id}>
          <StackedList.Item className="py-3" key={execution.name} isLast={executions.length - 1 === idx}>
            <StackedList.Field
              className="grid gap-y-1.5"
              title={<Title status={execution.status} title={execution.name || ''} />}
              description={
                <Description sha={execution.sha} description={execution.description} version={execution.version} />
              }
            />
            <StackedList.Field
              title={`${timeDistance(execution.finished, execution.started)}`}
              description={<TimeAgoCard timestamp={execution.started} />}
              right
              label
            />
          </StackedList.Item>
        </LinkComponent>
      ))}
    </StackedList.Root>
  )
}
