import { Icon, NoData, SkeletonList, StackedList, Text } from '../../../components'
import { Meter } from '../../../components/meter'
import { PipelineExecutionStatus } from '../common/execution-types'
import { ExecutionStatusIcon } from '../components/execution-status-icon'
import { IPipelineListProps } from './types'

const Title = ({ status, title }: { status?: PipelineExecutionStatus; title: string }) => {
  return (
    <div className="flex items-center gap-2">
      <ExecutionStatusIcon status={status} />
      <Text truncate>{title}</Text>
    </div>
  )
}

const Description = ({ sha, description, version }: { sha: string; description: string; version: string }) => {
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

export const PipelineList = ({
  pipelines,
  LinkComponent,
  handleResetQuery,
  isLoading,
  useTranslationStore,
  query,
  handleCreatePipeline,
  toPipelineDetails
}: IPipelineListProps) => {
  const noData = !pipelines || pipelines.length === 0

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
          title="No pipelines yet"
          description={['There are no pipelines in this project yet.', 'Create new one.']}
          primaryButton={{
            label: 'Create pipeline',
            onClick: handleCreatePipeline
          }}
        />
      </div>
    )
  }

  return (
    <StackedList.Root>
      {pipelines.map((pipeline, idx) => (
        <LinkComponent key={pipeline.id} to={toPipelineDetails?.(pipeline) || ''}>
          <StackedList.Item key={pipeline.name} isLast={pipelines.length - 1 === idx}>
            <StackedList.Field
              title={<Title status={pipeline.status} title={pipeline.name || ''} />}
              description={
                <Description
                  sha={pipeline.sha || ''}
                  description={pipeline.description || ''}
                  version={pipeline.version || ''}
                />
              }
            />
            <StackedList.Field title={<Meter data={pipeline.meter} />} label secondary right />
          </StackedList.Item>
        </LinkComponent>
      ))}
    </StackedList.Root>
  )
}
