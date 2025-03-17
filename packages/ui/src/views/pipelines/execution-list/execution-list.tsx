import { Icon, NoData, SkeletonList, StackedList } from '@/components'
import { PipelineExecutionStatus } from '@/views'
import { timeAgo, timeDistance } from '@utils/utils'

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
          <Icon size={11} name={'signpost'} />
          {version}
        </div>
      )}
      {sha && (
        <div className="flex h-4 items-center gap-1 rounded bg-cn-background-8 px-1.5 text-1 text-cn-foreground-1">
          <Icon className="text-icons-9" size={12} name={'tube-sign'} />
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
  useTranslationStore,
  query,
  handleExecutePipeline
}: IExecutionListProps) => {
  const noData = !executions || executions.length === 0

  const { t } = useTranslationStore()

  if (isLoading) {
    return <SkeletonList />
  }

  if (noData) {
    return query ? (
      <StackedList.Root className="grow place-content-center">
        <div className="flex items-center justify-center">
          <NoData
            iconName="no-search-magnifying-glass"
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
        </div>
      </StackedList.Root>
    ) : (
      <div className="m-auto flex items-center justify-center">
        <NoData
          iconName="no-data-folder"
          title="No executions yet"
          description={['There are no executions in this project yet.']}
          primaryButton={{
            label: 'Execute pipeline',
            onClick: handleExecutePipeline
          }}
        />
      </div>
    )
  }

  return (
    <StackedList.Root>
      {executions.map((execution, idx) => (
        <LinkComponent key={execution.id} to={execution.id}>
          <StackedList.Item className="py-3" key={execution.name} isLast={executions.length - 1 === idx}>
            <StackedList.Field
              className="gap-y-1.5"
              title={<Title status={execution.status} title={execution.name || ''} />}
              description={
                <Description sha={execution.sha} description={execution.description} version={execution.version} />
              }
            />
            <StackedList.Field
              title={`${timeDistance(execution.finished, execution.started)}`}
              description={`${timeAgo(execution.started)}`}
              right
              label
              secondary
            />
          </StackedList.Item>
        </LinkComponent>
      ))}
    </StackedList.Root>
  )
}
