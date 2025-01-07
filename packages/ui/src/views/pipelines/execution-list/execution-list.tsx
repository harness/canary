import { Icon, NoData, SkeletonList, StackedList, Text } from '@/components'
import { PipelineExecutionStatus } from '@/views'
import { timeAgo, timeDistance } from '@utils/utils'

import { ExecutionStatusIcon } from '../components/execution-status-icon'
import { IExecutionListProps, IExecutionType } from './types'

const Title = ({ status, title }: { status?: PipelineExecutionStatus; title: string }) => {
  return (
    <div className="flex items-center gap-2">
      {status && <ExecutionStatusIcon status={status} />}
      <Text truncate>{title}</Text>
    </div>
  )
}

const Description = ({ sha, description, version }: { sha: string; description: IExecutionType; version: string }) => {
  return (
    <div className="inline-flex max-w-full items-center gap-2 overflow-hidden pl-[24px]">
      {description && (
        <div className="w-full overflow-hidden break-words">
          <Text size={1} color="tertiaryBackground">
            {description || ''}
          </Text>
        </div>
      )}
      {sha && (
        <div className="flex items-center gap-1 rounded-md bg-tertiary-background/10 px-1.5">
          <Icon size={11} name={'tube-sign'} />
          {sha?.slice(0, 7)}
        </div>
      )}
      {version && (
        <div className="flex items-center gap-1">
          <Icon size={11} name={'signpost'} />
          {version}
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
      <StackedList.Root>
        <div className="flex min-h-[50vh] items-center justify-center py-20">
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
      <div className="flex min-h-[70vh] items-center justify-center py-20">
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
          <StackedList.Item key={execution.name} isLast={executions.length - 1 === idx}>
            <StackedList.Field
              title={<Title status={execution.status} title={execution.name || ''} />}
              description={
                <Description
                  sha={execution.sha || ''}
                  description={execution.description || ''}
                  version={execution.version || ''}
                />
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
